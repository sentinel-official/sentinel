const fs = window.require('fs');
const electron = window.require('electron');
const remote = electron.remote;
const { exec } = require('child_process');
const B_URL = 'https://api.sentinelgroup.io';
const SENT_DIR = getUserHome() + '/.sentinel';
const KEYSTORE_FILE = SENT_DIR + '/keystore';

if (!fs.existsSync(SENT_DIR)) fs.mkdirSync(SENT_DIR);

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
