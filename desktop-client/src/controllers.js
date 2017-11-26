const fs = require('fs');
const { exec } = require('child_process');

const B_URL = 'http://35.198.204.28:8000';
const SENT_DIR = getUserHome() + '/.sentinel';
const KEYSTORE_FILE = SENT_DIR + '/keystore';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
var OVPNDelTimer = null;

if (!fs.existsSync(SENT_DIR)) fs.mkdirSync(SENT_DIR);
if (fs.existsSync(OVPN_FILE)) fs.unlinkSync(OVPN_FILE);

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getKeystore(cb) {
  fs.readFile(KEYSTORE_FILE, 'utf8', function (err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

function getAccount(cb) {
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

function createAccount(password, cb) {
  fetch(B_URL + '/create-new-account', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
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
              private_key: private_key
            });
          }
        });
      }
    });
  });
}

function transferAmount(data, cb) {
  getKeystore(function (err, keystore) {
    if (err) cb(err, null);
    else {
      data['keystore'] = keystore;
      fetch(B_URL + '/send-amount', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
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

function getBalance(data, cb) {
  fetch(B_URL + '/get-balance', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        var balance = response['balance'];
        cb(null, balance);
      } else cb({ message: 'Error occurred while getting balance.' }, null);
    });
  });
}

function getTransactionReceipt(txHash, cb) {
  fetch(B_URL + '/transcation-receipt', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      tx_hash: txHash
    })
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        var txReceipt = response['receipt'];
        cb(null, txReceipt);
      } else cb({ message: 'Error occurred while getting transaction receipt.' }, null);
    });
  });
}

function getTransactionHistory(account_addr, cb) {
  fetch(B_URL + '/transaction-history', {
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

function getOVPNAndSave(account_addr, cb) {
  if (fs.existsSync(OVPN_FILE)) {
    cb(null);
  } else {
    fetch(B_URL + '/get-vpn-credentials', {
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
          var ovpn = response['ovpn'].join('');
          fs.writeFile(OVPN_FILE, ovpn, function (err) {
            if (err) cb(err);
            else cb(null);
          });
        } else {
          cb({ message: 'Error occurred while getting OVPN file, may be empty VPN resources.' }, null);
        }
      });
    });
  }
}

function getVPNPIDs(cb) {
  exec('pidof openvpn', function (err, stdout, stderr) {
    if (err) cb(err);
    else if (stdout) {
      var pids = stdout.trim();
      cb(null, pids);
    }
  });
}

function connectVPN(account_addr, cb) {
  var command = 'sudo openvpn ' + OVPN_FILE;
  getOVPNAndSave(account_addr, function (err) {
    if (err) cb(err);
    else {
      if (OVPNDelTimer) clearInterval(OVPNDelTimer);
      exec(command, function (err, stdout, stderr) {
        OVPNDelTimer = setTimeout(function () {
          fs.unlinkSync(OVPN_FILE);
        }, 60 * 1000);
      });
      setTimeout(function () {
        getVPNPIDs(function (err, pids) {
          if (err) cb(err);
          else cb(null);
        });
      }, 1000);
    }
  });
}

function disconnectVPN(cb) {
  getVPNPIDs(function (err, pids) {
    if (err) cb(err);
    else {
      var command = 'kill -2 ' + pids;
      exec(command, function (err, stdout, stderr) {
        if (err) cb(err);
        else {
          cb(null);
        }
      });
    }
  });
}
