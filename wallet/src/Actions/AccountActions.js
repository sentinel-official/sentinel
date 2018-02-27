// import { clearInterval, setTimeout } from 'timers';
const fs = window.require('fs');
const electron = window.require('electron');
const remote = electron.remote;
const { exec } = window.require('child_process');
const config = require('../config');
const B_URL = config.masterUrl;;
const ETH_BALANCE_URL = config.ethBalanceUrl;
const SENT_BALANCE_URL = config.sentBalanceUrl;
const ETH_TRANSC_URL = config.ethTransUrl;
const SENT_TRANSC_URL1 = config.sentTransUrl1;
const TRANSC_STATUS = config.transcStatus;
const GAS_API = config.gasApi;
const SENT_TRANSC_URL2 = `&topic1_2_opr=or&topic2=`;
const ETHER_API = `https://api.myetherapi.com/eth`;
const SENT_DIR = getUserHome() + '/.sentinel';
const KEYSTORE_FILE = SENT_DIR + '/keystore';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
var getVPN = null;
var OVPNDelTimer = null;
var CONNECTED = false;
var IPGENERATED = '';
var LOCATION = '';
var SPEED = '';

if (!fs.existsSync(SENT_DIR)) fs.mkdirSync(SENT_DIR);
if (fs.existsSync(OVPN_FILE)) fs.unlinkSync(OVPN_FILE);

function getUserHome() {
  return remote.process.env[(remote.process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

export const createAccount = (password, cb) => {
  fetch(B_URL + '/client/account', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      password: password
    })
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        var account_addr = response['account_addr'];
        var keystore = response['keystore'];
        var private_key = response['private_key'];

        fs.writeFile(KEYSTORE_FILE, keystore, function (err) {
          if (err) {
            cb(err, null);
          } else {
            cb(null, {
              account_addr: account_addr,
              private_key: private_key,
              keystore_addr: KEYSTORE_FILE
            });
          }
        });
      }
    });
  });
}

export const uploadKeystore = (keystore, cb) => {
  fs.writeFile(KEYSTORE_FILE, keystore, function (err) {
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  });
}

export const checkKeystore = (cb) => {
  fs.readFile(KEYSTORE_FILE, 'utf8', function (err, data) {
    if (err) cb(err);
    else cb(null);
  });
}

export function getKeystore(cb) {
  fs.readFile(KEYSTORE_FILE, 'utf8', function (err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

export function getAccount(cb) {
  getKeystore(function (err, data) {
    if (err) {
      cb(err, null);
    } else {
      data = JSON.parse(data);
      var account_addr = '0x' + data.address;
      cb(null, account_addr);
    }
  });
}

export function getGasPrice(cb) {
  fetch(GAS_API, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    }
  }).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (res) {
        var result = res['result'];
        var gasPrice = parseFloat(parseInt(result) / (10 ** 18)).toFixed(8)
        cb(null, gasPrice);
      })
    }
    else {
      cb({ message: 'Server Error' }, null)
    }
  })
}

export function getGasCost(from, to, amount, data, id, cb) {
  var data = {
    "method": "eth_estimateGas",
    "params": [{
      "from": from,
      "to": to,
      "value": amount,
      "data": data
    }],
    "id": id,
    "jsonrpc": "2.0"
  }
  fetch(ETHER_API, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (response) {
        console.log("Cost:", response)
        var gasCost = parseFloat(parseInt(response['result']), 16)
        getGasPrice(function (err, gasPrice) {
          if (err) {
            cb({ message: err.message }, null)
          }
          else {
            var gasLimit = parseFloat(gasCost * gasPrice).toFixed(8)
            cb(null, gasLimit)
          }
        })
      })
    }
    else {
      cb({ message: 'Server Error' }, null)
    }
  })
}

export function transferAmount(data, cb) {
  fetch(B_URL + '/client/raw-transaction', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      tx_data: data
    })
  }).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (response) {
        console.log("Response...", response)
        if (response.success === true) {
          var tx_hash = response['tx_hash'];
          cb(null, tx_hash);
        } else {
          cb({ message: JSON.parse(response.error.error.split("'").join('"')).message || 'Error occurred while initiating transfer amount.' }, null);
        }
      })
    }
    else {
      cb({ message: response.message || 'Internal Server Error' }, null);
    }
  });
}

export function getTransactionStatus(tx_addr, cb) {
  fetch(TRANSC_STATUS + tx_addr, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then(function (response) {
    response.json().then(function (response) {
      console.log("Response...", response)
      if (response.status === "1") {
        var status = response['result']["status"];
        cb(null, status);
      } else cb({ message: 'Error occurred while getting balance.' }, null);
    })
  });
}

export function payVPNUsage(data, cb) {
  fetch(B_URL + '/client/vpn/pay', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (response) {
        console.log("Res Tran...", response)
        if (response.success === true) {
          var tx_hash = response['tx_hashes'][0];
          cb(null, tx_hash);
        } else {
          cb({
            message: JSON.parse(response.errors[0].split("'").join('"')).error
              || 'Error occurred while initiating transfer amount.'
          }, null);
        }

      })
    }
    else {
      cb({ message: response.message || 'Internal Server Error' }, null);
    }
  });
}

export function getEthBalance(data, cb) {
  fetch(ETH_BALANCE_URL + data, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    }
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.status === '1') {
        var balance = response['result'] / (10 ** 18);
        cb(null, balance);
      } else cb({ message: 'Error occurred while getting balance.' }, null);
    });
  });
}

export function getSentBalance(data, cb) {
  fetch(SENT_BALANCE_URL + data, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    }
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.status === '1') {
        var balance = response['result'] / (10 ** 8);
        cb(null, balance);
      } else cb({ message: 'Error occurred while getting balance.' }, null);
    });
  });
}

export function getEthTransactionHistory(account_addr, page, cb) {
  fetch(ETH_TRANSC_URL + account_addr + '&page=' + page + "&offset=10&sort=desc", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    }
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.status === '1') {
        var history = response['result'];
        cb(null, history);
      } else cb({ message: 'Error occurred while getting transaction history.' }, null);
    });
  });
}

export function getSentTransactionHistory(account_addr, cb) {
  fetch(SENT_TRANSC_URL1 + account_addr + SENT_TRANSC_URL2 + account_addr, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    }
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.status === '1') {
        var history = response['result'];
        cb(null, history);
      } else cb({ message: 'Error occurred while getting transaction history.' }, null);
    });
  });
}

export function getVpnHistory(account_addr, cb) {
  fetch(B_URL + '/client/vpn/usage', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      account_addr: account_addr,
    })
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        var history = response['usage'];
        cb(null, history);
      } else cb({ message: response.message || 'Error occurred while getting vpn history.' }, null);
    });
  });
}

export const getVPNList = (cb) => {
  fetch(B_URL + '/client/vpn/list', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
  }).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (response) {
        if (response.success === true) {
          cb(null, response.list);
        } else {
          cb({ message: 'Error occurred while getting vpn list.' }, null);
        }
      });
    }
    else {
      cb({ message: 'Server Error.Please Try Again' }, null);
    }
  });
}


export function connectVPN(account_addr, vpn_addr, cb) {
  if (remote.process.platform === 'darwin') {
    exec("if which openvpn > /dev/null;then echo 'true' ; else echo 'false'; fi",
      function (err, stdout, stderr) {
        console.log("Err..", err, "Out..", stdout.toString(), "Std..", stderr)
        if (stdout.trim().toString() == 'false') {
          cb({ message: 'false' }, true)
        }
        else {
          nextStep();
        }
      })
  }
  else {
    nextStep();
  }
  function nextStep() {
    var command;
    if (remote.process.platform === 'darwin') {
      var ovpncommand = 'openvpn ' + OVPN_FILE;
      command = `/usr/bin/osascript -e 'do shell script "${ovpncommand}" with administrator privileges'`
    }
    else {
      command = 'sudo openvpn ' + OVPN_FILE;
    }
    fetch(B_URL + '/client/vpn', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        account_addr: account_addr,
        vpn_addr: vpn_addr
      })
    }).then(function (response) {
      response.json().then(function (res) {
        if (res.success === true) {
          getOVPNAndSave(account_addr, res['ip'], res['port'], vpn_addr, res['token'], function (err) {
            if (err) cb(err, false);
            else {
              if (OVPNDelTimer) clearInterval(OVPNDelTimer);

              exec(command, function (err, stdout, stderr) {
                OVPNDelTimer = setTimeout(function () {
                  fs.unlinkSync(OVPN_FILE);
                }, 5 * 1000);
              });
              var count = 0;
              if (remote.process.platform === 'darwin') checkVPNConnection();
              else {
                setTimeout(function () {
                  getVPNPIDs(function (err, pids) {
                    if (err) cb({ message: err }, false);
                    else {
                      CONNECTED = true;
                      cb(null);
                    }
                  });

                }, 1000);
              }
              function checkVPNConnection() {
                getVPNPIDs(function (err, pids) {
                  if (err) cb({ message: err }, false);
                  else {
                    console.log("PIDS:", pids)
                    CONNECTED = true;
                    cb(null, false);
                    count = 10;
                  }

                  count++;

                  if (count < 10) {
                    setTimeout(function () { checkVPNConnection(); }, 5000);
                  }
                });
              }
            }
          });
        }
        else {
          cb({ message: res.message || 'Connecting VPN Failed.Please Try Again' }, false);
        }
      })
    })
  }
}

function getOVPNAndSave(account_addr, vpn_ip, vpn_port, vpn_addr, nonce, cb) {
  if (fs.existsSync(OVPN_FILE)) {
    cb(null);
  } else {
    fetch('http:' + vpn_ip + ':' + vpn_port + '/client/generateOVPN', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        account_addr: account_addr,
        vpn_addr: vpn_addr,
        token: nonce
      })
    }).then(function (response) {
      if (response.status === 200) {
        response.json().then(function (response) {
          if (response.success === true) {
            if (response['node'] === null) {
              cb({ message: 'Something wrong. Please Try Later' })
            }
            else {
              var ovpn = response['node']['vpn']['ovpn'].join('');
              IPGENERATED = response['node']['vpn']['ovpn'][3].split(' ')[1];
              LOCATION = response['node']['location']['city'];
              SPEED = Number(response['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + 'MBPS';
              fs.writeFile(OVPN_FILE, ovpn, function (err) {
                if (err) cb(err);
                else cb(null);
              });
            }
          } else {
            cb({ message: response.message || 'Error occurred while getting OVPN file, may be empty VPN resources.' });
          }
        });
      }
      else {
        cb({ message: 'Server Error' })
      }
    });
  }
}

export function getVPNPIDs(cb) {
  exec('pidof openvpn', function (err, stdout, stderr) {
    if (err) cb(err);
    else if (stdout) {
      var pids = stdout.trim();
      cb(null, pids);
    }
    else {
      cb(true, null);
    }
  });
}

export const isOnline = function () {
  if (window.navigator.onLine) {
    return true
  }
  else {
    return false
  }
}

export function disconnectVPN(cb) {
  getVPNPIDs(function (err, pids) {
    if (err) cb(err);
    else {
      var command = 'kill -2 ' + pids;
      if (remote.process.platform === 'darwin') {
        command = `/usr/bin/osascript -e 'do shell script "${command}" with administrator privileges'`
      }
      exec(command, function (err, stdout, stderr) {
        console.log("Err..", err, "Out..", stdout.toString(), "Std..", stderr)
        if (err) cb({ message: err.toString() || 'Disconnecting failed' });
        else {
          CONNECTED = false;
          cb(null);
        }
      });
    }
  });
}

export function getVPNdetails(cb) {
  var data = {
    ip: IPGENERATED,
    location: LOCATION,
    speed: SPEED
  }
  if (CONNECTED) {
    cb(true, data);
  }
  else {
    cb(false, data);
  }
}

export function isVPNConnected(cb) {
  getVPNPIDs(function (err, pids) {
    if (err) {
      cb(err, null)
    } else if (pids) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  });
}