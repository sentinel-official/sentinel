const fs = require('fs');
const { exec } = require('child_process');

const B_URL = 'http://35.198.204.28:8000';
const SENT_DIR = getUserHome() + '/.sentinel';
const KEYSTORE_FILE = SENT_DIR + '/keystore';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
var OVPNDelTimer = null;
var shell = require('electron').shell;

if (!fs.existsSync(SENT_DIR)) fs.mkdirSync(SENT_DIR);
if (fs.existsSync(OVPN_FILE)) fs.unlinkSync(OVPN_FILE);

var qrcode;

function makeQRCode (str) {
    if (!qrcode) {
        qrcode = new QRCode("qrcode", {width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    console.log(qrcode, 'qrcode', document.getElementById('qrcode'));
    console.log(str, 'inside qr code');

    qrcode.makeCode(str);
}

//makeQRCode('0x0375dbf0957b76313bd9b54e0c054eb1b55ab9fb');

function _showAccountFunctions(account_addr) {
    console.log('account exists', fs.existsSync(KEYSTORE_FILE));
    if (fs.existsSync(KEYSTORE_FILE)) {
      document.getElementById('create-wallet').style.display = 'none';
      $('#dashboard-menu').click();

      var sectionId = 'dashboard';
      
        $('#' + sectionId).show()
        $('#' + sectionId + ' section').show()
        
        document.getElementById('create_wallet').style.display = 'none';

        document.getElementById('vpn-zones-menu').style.display = 'block';
        document.getElementById('dashboard-menu').style.display = 'block';
        document.getElementById('vpn-usage-menu').style.display = 'block';
        document.getElementById('vpn-nav-section').style.display = 'block';

        document.getElementById('account_addr').innerHTML = account_addr;
        makeQRCode(account_addr);

        isVPNConnected();
        _getBalance();
        _getTransactionHistory();
    } else {
      $('#create-wallet').click();

      console.log($("#create-wallet"));
      var sectionId = 'create_wallet';

      $('#' + sectionId).show()
      $('#' + sectionId + ' section').show()

      document.getElementById('vpn-zones-menu').style.display = 'none';
      document.getElementById('dashboard-menu').style.display = 'none';
      document.getElementById('vpn-usage-menu').style.display = 'none';
      document.getElementById('vpn-nav-section').style.display = 'none';
    }
  }

  function _getAccount() {
    getAccount(function (err, account_addr) {
      if (err) {
        console.log(err, 'inside getAccount error');
      } else {
        console.log(account_addr, 'inside getAccount success');
      }

      _showAccountFunctions(account_addr);
    });
  };

  function _createAccount(form) {
    document.getElementById('create-account-submit').disabled = true;
    var password = form.password.value;

    createAccount(password, function (err, account) {
      if (err) console.log(err);
      else _getAccount();
    });
  }

  function _connectVPN() {
    var account_addr = document.getElementById('account_addr').innerHTML;
    //_toggleVPNButtons();

    connectVPN(account_addr, function (err, response) {
      if (err) {
          alert(err.message);
        console.log(err);
      } else {
          console.log('Connected', response);
          $(".vpn-connection.connected").show();
          $(".vpn-connection.disconnected").hide();
        //_toggleVPNButtons();
      }
    });
  }

  function _toggleVPNButtons() {
    document.getElementById("connect-vpn-button").disabled =
      !document.getElementById("connect-vpn-button").disabled;
    document.getElementById("disconnect-vpn-button").disabled =
      !document.getElementById("disconnect-vpn-button").disabled;
  }

  function _disconnectVPN() {
    // _toggleVPNButtons();
    disconnectVPN(function (err) {
      if (err) {
        console.log(err);
        // _toggleVPNButtons();
      } else {
        console.log('Disconnected');
        $(".vpn-connection.connected").hide();
        $(".vpn-connection.disconnected").show();
      }
    });
  }

  function _transferAmount(form) {
    console.log('form', form);
    // document.getElementById('tx_hash').style.display = 'none';
    document.getElementById('transfer-amount-submit').disabled = true;

    var data = {};
    data['from_addr'] = document.getElementById('account_addr').innerHTML;
    data['to_addr'] = document.getElementById('toAddress').value;
    data['amount'] = parseInt(document.getElementById('amount').value);
    data['gas'] = parseInt(document.getElementById('gas').value);
    data['unit'] = 'SENT';//form.unit.value;
    data['password'] = document.getElementById('password').value;

    transferAmount(data, function (err, tx_hash) {
      if (err) console.log(err);
      else {
        // document.getElementById('tx_hash').innerHTML = 'Transaction Hash: ' + tx_hash;
        // document.getElementById('tx_hash').style.display = '';
        document.getElementById('transfer-amount-submit').disabled = false;

        _getTransactionHistory();
      }
    });

    $('#dashboard-menu').click();
    
    var sectionId = 'dashboard';
    
    $('#' + sectionId).show()
    $('#' + sectionId + ' section').show()
  }

  function _getBalance() {
    var data = {
      'account_addr': document.getElementById('account_addr').innerHTML,
      'unit': 'SENT'
    };
    if (data['account_addr'].length > 0) {
      setInterval(function () {
        getBalance(data, function (err, balance) {
          if (err) console.log(err);
          else document.getElementById('balance').innerHTML = balance + ' SENTs';
        });
      }, 5 * 1000);
    }
  }

  function _getTransactionReceipt(form) {
    document.getElementById('check-tx-status-submit').disabled = true;
    var txHash = form.tx_hash.value;
    getTransactionReceipt(txHash, function (err, txReceipt) {
      if (err) console.log(err);
      else {
        document.getElementById('transaction-receipt-from').innerHTML = txReceipt['from'];
        document.getElementById('transaction-receipt-to').innerHTML = txReceipt['to'];
        document.getElementById('transaction-receipt-blocknumber').innerHTML = txReceipt['blockNumber'];
        document.getElementById('transaction-receipt-blockhash').innerHTML = txReceipt['blockHash'];
        document.getElementById('transaction-receipt-gasused').innerHTML = txReceipt['gasUsed'];
        document.getElementById('transaction-receipt-div').style.display = '';
      }
      document.getElementById('check-tx-status-submit').disabled = false;
    });
  }     

  function _getTransactionHistory() {
    var account_addr = document.getElementById('account_addr').innerHTML;
    var transactionHistoryDiv = document.getElementById('all-transactions-history')
    
    getTransactionHistory(account_addr, function (err, history) {
      if (err) console.log(err);
      else {
        console.log('All transactions', history);
        transactionHistoryDiv.innerHTML = '';

        history.forEach(function (record, index) {
          var to_address = record['to_address'];
          var amount = record['amount'];
          var status = 'success';
          var unit = record['unit'] + 's';
          var tx_hash = record['tx_hash'];

          // transactionElement.replace(/[STATUS_CLASS]/g, 'success');
          // transactionElement.replace(/[AMOUNT]/g, amount);
          // transactionElement.replace('UNIT', unit);
          // transactionElement.replace('[STATUS]', 'success');
          // transactionElement.replace('[TO_ADDRESS]', to_address);
          // transactionElement.replace('[TX_HASH]', tx_hash);

          var transactionElement = '<li class="list-group-item ' + status + '"> \
          <div class="media-body"> \
            <div class="row"> \
              <div class="col-6"> \
                <strong>Amount:</strong> \
                <span>' + amount + ' '+ unit +'</span> \
              </div> \
              <div class="col-6"> \
                <strong>Status:</strong> \
                <span>' + status + '</span> \
              </div> \
            </div> \
            <div class="row"> \
                <div class="col-6"> \
                  <strong>To</strong> \
                  <span>' + to_address + '</span> \
                </div> \
            </div> \
            <div class="row"> \
                <div class="col-12"> \
                  <strong>Tx:</strong> \
                  <span> \
                    <a onclick="openInExternalBrowser(\'' + tx_hash + '\')" \
                      href="javascript:;"> \
                      ' + tx_hash + ' \
                    </a> \
                  </span> \
                </div> \
            </div> \
          </div> \
        </li>';

          console.log(transactionElement);


          // var p = document.createElement('p');
          // p.innerHTML = to_address + ' | ' + amount + ' | ' + unit + ' | ' + tx_hash;
          // p.style.margin = '0px';
          transactionHistoryDiv.innerHTML += transactionElement;
        });
      }
    });
  }


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
      } else {
          console.log('Error while creating account', response);
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
            console.log(response);
          cb({ message: response.message || 'Error occurred while getting OVPN file, may be empty VPN resources.' }, null);
        }
      });
    });
  }
}

function isVPNConnected() {
    getVPNPIDs(function (err, pids) {
        console.log('isVPNConnected', err, pids);
        if (err) {
            console.log('Error while checking isVPNConnected', err);
            $(".vpn-connection.connected").hide();
            $(".vpn-connection.disconnected").show();
        } else if (pids) {
            $(".vpn-connection.connected").show();
            $(".vpn-connection.disconnected").hide();
        } else {
            $(".vpn-connection.connected").hide();
            $(".vpn-connection.disconnected").show();
        }
    });
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

//open links externally by default
function openInExternalBrowser(url) {
    console.log(url, shell);
    shell.openExternal(url);
    console.log('Open is done');
};

function showMap () {
  console.log('inside showMap');
  $('#world-map-markers').vectorMap({
    map: 'world_mill',
    scaleColors: ['#C8EEFF', '#0071A4'],
    normalizeFunction: 'polynomial',
    hoverOpacity: 0.7,
    hoverColor: false,
    markerStyle: {
      initial: {
        fill: '#F8E23B',
        stroke: '#383f47'
      }
    },
    backgroundColor: '#383f47',
    markers: [
      {latLng: [37.7749, 122.4194], name: 'San Fransisco'},
      {latLng: [41.90, 12.45], name: 'Vatican City'},
      {latLng: [43.73, 7.41], name: 'Monaco'},
      {latLng: [43.93, 12.46], name: 'San Marino'},
      {latLng: [7.11, 171.06], name: 'Marshall Islands'},
      {latLng: [3.2, 73.22], name: 'Maldives'},
      {latLng: [12.05, -61.75], name: 'Grenada'},
      {latLng: [13.16, -59.55], name: 'Barbados'},
      {latLng: [17.11, -61.85], name: 'Antigua and Barbuda'},
      {latLng: [14.01, -60.98], name: 'Saint Lucia'},
      {latLng: [1.3, 103.8], name: 'Singapore'},
      {latLng: [15.3, -61.38], name: 'Dominica'},
      {latLng: [-20.2, 57.5], name: 'Mauritius'},
      {latLng: [26.02, 50.55], name: 'Bahrain'}
    ]
  });
}