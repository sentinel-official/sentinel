const fs = window.require('fs');
const electron = window.require('electron');
const remote = electron.remote;
const { exec } = window.require('child_process');
const B_URL = 'http://35.198.246.114:8000';
const ETH_BALANCE_URL = `https://api.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
&module=account&action=balance&tag=latest&address=`;
const SENT_BALANCE_URL = `https://api.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
&module=account&action=tokenbalance&tag=latest&contractaddress=0xa44E5137293E855B1b7bC7E2C6f8cD796fFCB037&address=`;
const ETH_TRANSC_URL = `https://api.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
&module=account&action=txlist&startblock=0&endblock=latest&address=`;
const SENT_TRANSC_URL1 = `https://api.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
&module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0xa44E5137293E855B1b7bC7E2C6f8cD796fFCB037
&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1=`;
const SENT_TRANSC_URL2 = `&topic1_2_opr=or&topic2=`;
const SENT_DIR = getUserHome() + '/.sentinel';
const KEYSTORE_FILE = SENT_DIR + '/keystore';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
var OVPNDelTimer = null;
var CONNECTED = false;
var IPGENERATED = '';
var LOCATION = '';
var SPEED = '';

if (!fs.existsSync(SENT_DIR)) fs.mkdirSync(SENT_DIR);
if (fs.existsSync(OVPN_FILE)) fs.unlinkSync(OVPN_FILE);

function getUserHome() {
  return remote.process.env[(remote.process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
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

function getKeystore(cb) {
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


export function transferAmount(data, cb) {
  getKeystore(function (err, keystore) {
    if (err) cb(err, null);
    else {
      data['keystore'] = keystore;
      fetch(B_URL + '/client/transaction', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      }).then(function (response) {
        response.json().then(function (response) {
          if (response.success === true) {
            var tx_hash = response['tx_hash'];
            cb(null, tx_hash);
          } else {
            cb({ message: 'Error occurred while initiating transfer amount.' }, null);
          }
        })
      });
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
      if (response.status == '1') {
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
      if (response.status == '1') {
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
      if (response.status == '1') {
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
      if (response.status == '1') {
        var history = response['result'];
        cb(null, history);
      } else cb({ message: 'Error occurred while getting transaction history.' }, null);
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
    response.json().then(function (response) {
      if (response.success === true) {
        cb(null, response.list);
      } else {
        cb({ message: 'Error occurred while getting vpn list.' }, null);
      }
    });
  });
}

export function connectVPN(account_addr, vpn_addr, cb) {
  var command = 'sudo openvpn ' + OVPN_FILE;
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
        getOVPNAndSave(account_addr, res['ip'], res['port'],vpn_addr, res['token'], function (err) {
          if (err) cb(err);
          else {
            if (OVPNDelTimer) clearInterval(OVPNDelTimer);

            exec(command, function (err, stdout, stderr) {
              OVPNDelTimer = setTimeout(function () {
                fs.unlinkSync(OVPN_FILE);
              }, 5 * 1000);
            });

            setTimeout(function () {
              getVPNPIDs(function (err, pids) {
                if (err) cb(err);
                else {
                  CONNECTED = true;
                  cb(null);
                }
              });

            }, 1000);
          }
        });
      }
      else {
        cb({ message: res.message || 'Error occurred while connecting vpn.' }, null);
      }
    })
  })
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
        vpn_addr:vpn_addr,
        token: nonce
      })
    }).then(function (response) {
      response.json().then(function (response) {
        if (response.success === true) {
          var ovpn = response['node']['vpn']['ovpn'].join('');
          IPGENERATED = response['node']['vpn']['ovpn'][3].split(' ')[1];
          LOCATION = response['node']['location']['city'];
          SPEED = Number(response['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + 'MBPS';
          fs.writeFile(OVPN_FILE, ovpn, function (err) {
            if (err) cb(err);
            else cb(null);
          });
        } else {
          cb({ message: response.message || 'Error occurred while getting OVPN file, may be empty VPN resources.' }, null);
        }
      });
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

export function disconnectVPN(cb) {
  getVPNPIDs(function (err, pids) {
    if (err) cb(err);
    else {
      var command = 'kill -2 ' + pids;
      exec(command, function (err, stdout, stderr) {
        if (err) cb(err);
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