import { sendError } from '../helpers/ErrorLog';
const fs = window.require('fs');
const electron = window.require('electron');
const remote = electron.remote;
const { exec } = window.require('child_process');
const config = require('../config');
const B_URL = 'https://api.sentinelgroup.io';
var ETH_BALANCE_URL;
var SENT_BALANCE_URL;
var ETH_TRANSC_URL;
var SENT_TRANSC_URL1;
var TRANSC_STATUS;
const SENT_TRANSC_URL2 = `&topic1_2_opr=or&topic2=`;
const SENT_DIR = getUserHome() + '/.sentinel';
const KEYSTORE_FILE = SENT_DIR + '/keystore';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
var getVPN = null;
var OVPNDelTimer = null;
var CONNECTED = false;
var SESSION_NAME = '';
var IPGENERATED = '';
var LOCATION = '';
var SPEED = '';
var KEYSTOREDATA = '';
var sudo = remote.require('sudo-prompt');
var connect = {
  name: 'ConnectOpenVPN'
};
var disconnect = {
  name: 'DisconnectOpenVPN'
};

// exec('dir', (err, stdout, stderr) => {
//   console.log("dir:", stdout)
// })

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
    else {
      KEYSTOREDATA = data;
      cb(null, data);
    }
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

export function transferAmount(net, data, cb) {
  fetch(B_URL + '/client/raw-transaction', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      tx_data: data,
      net: net
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
  if (localStorage.getItem('config') === 'TEST')
    TRANSC_STATUS = config.test.transcStatus
  else
    TRANSC_STATUS = config.main.transcStatus
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
          if (response.errors.length > 0) {
            cb({
              message: JSON.parse(response.errors[0].split("'").join('"')).error
                || 'Error occurred while initiating transfer amount.'
            }, null);
          }
          else {
            cb({
              message: 'Something went wrong in transaction'
            }, null);
          }
        }

      })
    }
    else {
      cb({ message: response.message || 'Internal Server Error' }, null);
    }
  });
}

export function getFreeAmount(account_addr, cb) {
  fetch(B_URL + '/dev/free', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      account_addr: account_addr
    })
  }).then(function (response) {
    response.json().then(function (response) {
      console.log("Free res:", response)
      cb(response.message)
    })
  })
}

export function getVPNUsageData(account_addr, cb) {
  fetch(B_URL + '/client/vpn/current', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      account_addr: account_addr,
      session_name: SESSION_NAME
    })
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        var usage = response['usage'];
        cb(null, usage)
      }
      else {
        cb({ message: response.message || 'No data got' }, null);
      }
    })
  })
}

export function reportPayment(data, cb) {
  fetch(B_URL + '/client/vpn/report', {
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
          var tx_hash = response['tx_hash'];
          cb(null, tx_hash);
        }
        else {
          cb({ message: JSON.parse(response.error.error.split("'").join('"')).message || 'Transaction Failed' }, null);
        }
      })
    }
    else {
      cb({ message: response.message || 'Internal Server Error' }, null);
    }
  });
}

export function getEthBalance(data, cb) {
  if (localStorage.getItem('config') === 'TEST')
    ETH_BALANCE_URL = config.test.ethBalanceUrl;
  else
    ETH_BALANCE_URL = config.main.ethBalanceUrl;
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
  if (localStorage.getItem('config') === 'TEST')
    SENT_BALANCE_URL = config.test.sentBalanceUrl
  else
    SENT_BALANCE_URL = config.main.sentBalanceUrl
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
  if (localStorage.getItem('config') === 'TEST')
    ETH_TRANSC_URL = config.test.ethTransUrl
  else
    ETH_TRANSC_URL = config.main.ethTransUrl
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
  if (localStorage.getItem('config') === 'TEST')
    SENT_TRANSC_URL1 = config.test.sentTransUrl1
  else
    SENT_TRANSC_URL1 = config.main.sentTransUrl1
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
  CONNECTED = false;
  if (remote.process.platform === 'darwin') {
    exec("if which openvpn > /dev/null;then echo 'true' ; else echo 'false'; fi",
      function (err, stdout, stderr) {
        console.log("Err..", err, "Out..", stdout.toString(), "Std..", stderr)
        if (stdout.trim().toString() == 'false') {
          cb({ message: 'false' }, true, false)
        } else {
          nextStep();
        }
      })
  }
  else if (remote.process.platform === 'win32') {
    exec('cd c:\\Program Files && dir openvpn.exe /s /p | findstr "openvpn"', function (err, stdout, stderr) {
      if (stdout.toString() === '') {
        exec('cd c:\\Program Files (x86) && dir openvpn.exe /s /p | findstr "openvpn"', function (error, stdout1, stderr1) {
          if (stdout.toString() === '') {
            cb({ message: 'false' }, false, true, false);
          }
          else {
            nextStep();
          }
        })
      } else {
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
    } else if (remote.process.platform === 'win32') {
      command = 'resources\\extras\\bin\\openvpn.exe ' + OVPN_FILE;
    } else {
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
            if (err) cb(err, false, false, false);
            else {
              if (OVPNDelTimer) clearInterval(OVPNDelTimer);
              if (remote.process.platform === 'win32') {
                sudo.exec(command, connect,
                  function (error, stdout, stderr) {
                    console.log('Err...', error, 'Stdout..', stdout, 'Stderr..', stderr)
                    OVPNDelTimer = setTimeout(function () {
                      fs.unlinkSync(OVPN_FILE);
                    }, 5 * 1000);
                  }
                );
              }
              else {
                exec(command, function (err, stdout, stderr) {
                  OVPNDelTimer = setTimeout(function () {
                    fs.unlinkSync(OVPN_FILE);
                  }, 5 * 1000);
                });
              }
              var count = 0;
              if (remote.process.platform === 'darwin') checkVPNConnection();
              else if (remote.process.platform === 'win32') checkWindows();
              else {
                setTimeout(function () {
                  getVPNPIDs(function (err, pids) {
                    if (err) cb({ message: err }, false, false, false);
                    else {
                      CONNECTED = true;
                      let data = JSON.parse(KEYSTOREDATA);
                      data.isConnected = true;
                      data.ipConnected = IPGENERATED;
                      data.location = LOCATION;
                      data.speed = SPEED;
                      data.session_name = SESSION_NAME;
                      let keystore = JSON.stringify(data);
                      fs.writeFile(KEYSTORE_FILE, keystore, function (err) {
                      });
                      cb(null, false, false, false);
                    }
                  });

                }, 1000);
              }
              function checkWindows() {
                console.log('IN windows..')
                exec('tasklist /v /fo csv | findstr /i "openvpn.exe"', function (err, stdout, stderr) {
                  console.log('Win Err...', err, 'Stdout..', stdout, 'Stderr..', stderr)
                  if (stdout.toString() === '') {

                  }
                  else {
                    CONNECTED = true;
                    let data = JSON.parse(KEYSTOREDATA);
                    data.isConnected = true;
                    data.ipConnected = IPGENERATED;
                    data.location = LOCATION;
                    data.speed = SPEED;
                    data.session_name = SESSION_NAME;
                    let keystore = JSON.stringify(data);
                    fs.writeFile(KEYSTORE_FILE, keystore, function (err) {
                    });
                    cb(null, false, false, false);
                    count = 8;
                  }
                  count++;
                  if (count < 8) {
                    setTimeout(function () { checkWindows(); }, 5000);
                  }
                  if (count == 8 && CONNECTED === false) {
                    cb({ message: 'Something went wrong.Please Try Again' }, false, false, false)
                  }
                })
              }
              function checkVPNConnection() {
                getVPNPIDs(function (err, pids) {
                  if (err) cb({ message: err }, false, false, false);
                  else {
                    console.log("PIDS:", pids)
                    CONNECTED = true;
                    let data = JSON.parse(KEYSTOREDATA);
                    data.isConnected = true;
                    data.ipConnected = IPGENERATED;
                    data.location = LOCATION;
                    data.speed = SPEED;
                    data.session_name = SESSION_NAME;
                    let keystore = JSON.stringify(data);
                    fs.writeFile(KEYSTORE_FILE, keystore, function (err) {
                    });
                    cb(null, false, false, false);
                    count = 8;
                  }

                  count++;

                  if (count < 8) {
                    setTimeout(function () { checkVPNConnection(); }, 5000);
                  }
                  if (count == 8 && CONNECTED === false) {
                    cb({ message: 'Something went wrong.Please Try Again' }, false, false, false)
                  }
                });
              }
            }
          });
        }
        else {
          if (res.account_addr)
            cb({ message: res.message || 'Initial Payment is not done' }, false, false, res.account_addr);
          else
            cb({ message: res.message || 'Connecting VPN Failed.Please Try Again' }, false, false, false);
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
            console.log("vpn respon..", response)
            if (response['node'] === null) {
              cb({ message: 'Something wrong. Please Try Later' })
            }
            else {
              var ovpn = response['node']['vpn']['ovpn'].join('');
              SESSION_NAME = response['session_name'];
              IPGENERATED = response['node']['vpn']['ovpn'][3].split(' ')[1];
              LOCATION = response['node']['location']['city'];
              SPEED = Number(response['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + ' Mbps';
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
  if (remote.process.platform === 'win32') {
    sudo.exec('taskkill /IM openvpn.exe /f', disconnect,
      function (error, stdout, stderr) {
        if (error) cb({ message: error.toString() || 'Disconnecting failed' });
        else {
          CONNECTED = false;
          let data = JSON.parse(KEYSTOREDATA);
          data.isConnected = null;
          let keystore = JSON.stringify(data);
          fs.writeFile(KEYSTORE_FILE, keystore, function (err) {
          });
          cb(null);
        }
      });
  }
  else {
    getVPNPIDs(function (err, pids) {
      if (err) cb(err);
      else {
        var command = 'kill -2 ' + pids;
        if (remote.process.platform === 'darwin') {
          command = `/usr/bin/osascript -e 'do shell script "${command}" with administrator privileges'`
        }
        exec(command, function (err, stdout, stderr) {
          console.log("Err..", err, "Out..", stdout.toString(), "Std..", stderr)
          CONNECTED = false;
          let data = JSON.parse(KEYSTOREDATA);
          data.isConnected = null;
          let keystore = JSON.stringify(data);
          fs.writeFile(KEYSTORE_FILE, keystore, function (err) {
          });
          cb(null);
        });
      }
    });
  }
}

export function getVPNdetails(cb) {
  var data = {
    ip: IPGENERATED,
    location: LOCATION,
    speed: SPEED
  }
  if (CONNECTED) {
    console.log('data...', data)
    cb(true, data);
  }
  else {
    cb(false, data);
  }
}

export function getVPNProcesses(cb) {
  exec('tasklist /v /fo csv | findstr /i "openvpn.exe"', function (err, stdout, stderr) {
    if (stdout.toString() === '') {
      cb(true, null)
    }
    else {
      cb(null, true)
    }
  })
}

export function isVPNConnected(cb) {
  if (remote.process.platform === 'win32') {
    getVPNProcesses(function (err, pid) {
      if (err) {
        cb(err, false)
      } else {
        cb(null, true)
      }
    });
  }
  else {
    getVPNPIDs(function (err, pids) {
      if (err) {
        cb(err, null)
      } else if (pids) {
        cb(null, true)
      } else {
        cb(true, false)
      }
    });
  }
}

export function getLatency(url, cb) {
  if (remote.process.platform == 'win32') {
    exec("ping -n 2 " + url + " | findstr /i \"average\"", function (err, stdout, stderr) {
      if (err) cb(err, null)
      else cb(null, stdout.toString().split(',')[2].split('=')[1].split('ms')[0]);
    })
  }
  else {
    exec("ping -c 2 " + url + " | tail -1 | awk '{print $4}' | cut -d '/' -f 2", function (err, stdout, stderr) {
      if (err) cb(err, null)
      else cb(null, stdout.toString())
    })
  }
}

export function getVPNConnectedData(cb) {
  isVPNConnected(function (err, connected) {
    if (connected) {
      getKeystore(function (err, data) {
        if (err) cb(err, null)
        else {
          let keystore = JSON.parse(data);
          if (keystore.isConnected) {
            CONNECTED = true;
            IPGENERATED = keystore.ipConnected;
            LOCATION = keystore.location;
            SPEED = keystore.speed;
            SESSION_NAME = keystore.session_name;
            let connectedData = {
              ip: IPGENERATED,
              location: LOCATION,
              speed: SPEED
            }
            cb(null, connectedData)
          }
          else {
            cb(err, null);
          }
        }
      })
    }
    else {
      cb(err, null)
    }
  })
}