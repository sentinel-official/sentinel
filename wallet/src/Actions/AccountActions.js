const fs = window.require('fs');
const electron = window.require('electron');
const remote = electron.remote;
const { exec } = window.require('child_process');
const B_URL = 'http://35.198.244.134:8000';
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


export function getBalance(data, cb) {
  fetch(B_URL + '/client/account/balance', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        var balance = response['balances'];
        cb(null, balance);
      } else cb({ message: 'Error occurred while getting balance.' }, null);
    });
  });
}

export function getTransactionHistory(account_addr, cb) {
  fetch(B_URL + '/client/transaction/history', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      account_addr: account_addr
    })
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        var history = response['history'];
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

  getOVPNAndSave(account_addr, vpn_addr, function (err) {
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

function getOVPNAndSave(account_addr, vpn_addr, cb) {
  if (fs.existsSync(OVPN_FILE)) {
    cb(null);
  } else {
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
    else{
      cb(true,null);
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