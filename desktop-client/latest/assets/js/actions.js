const fs = require('fs');
const { exec } = require('child_process');

const B_URL = 'http://35.198.204.28:8000/client';
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

  function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
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
    alert('CONNECT VPN');
    var account_addr = document.getElementById('account_addr').innerHTML;
    var vpn_addr = document.getElementById('selectedVPN').value;
    //_toggleVPNButtons();

    connectVPN(account_addr, vpn_addr, function (err, response) {
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
    data['is_vpn_payment'] = document.getElementById('is_vpn').value == 'true' ? true : false;

    console.log(data);

    transferAmount(data, function (err, tx_hash) {
      if (err) {
        alert(err.message)
        console.log(err);
      } else {
        // document.getElementById('tx_hash').innerHTML = 'Transaction Hash: ' + tx_hash;
        // document.getElementById('tx_hash').style.display = '';
        document.getElementById('transfer-amount-submit').disabled = false;
        alert('Your transaction is initiated.');

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
  fetch(B_URL + '/account', {
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
      fetch(B_URL + '/transaction', {
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
  fetch(B_URL + '/account/balance', {
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
  fetch(B_URL + '/transcation/receipt', {
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
  fetch(B_URL + '/transaction/history', {
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

function getOVPNAndSave(account_addr, vpn_addr, cb) {
  if (fs.existsSync(OVPN_FILE)) {
    cb(null);
  } else {
    alert(account_addr + vpn_addr)
    fetch(B_URL + '/vpn', {
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

var callVPNstats = null;

function connectVPN(account_addr, vpn_addr, cb) {
  var command = 'sudo openvpn ' + OVPN_FILE;

  getOVPNAndSave(account_addr, vpn_addr, function (err) {
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

      callVPNstats = window.setInterval(function () {
        showVPNUsageStats();
      }, 10*1000);
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

        window.clearInterval(callVPNstats);
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

function getVPNList() {
  console.log('inside get vpn list');

  fetch(B_URL + '/vpn/list', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    }
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        var vpnList = response.list;
        
        updateSelectVPNList(vpnList);
      } else {
        console.log('Error while fetching VPN list', response);
      }
    });
  });
}

function updateSelectVPNList(vpnList) {

  var myDiv = document.getElementById("VPNSelectList");

  //Create array of options to be added
  var array = vpnList;

  //Create and append select list
  var selectList = document.createElement("select");
  selectList.id = "selectedVPN";
  myDiv.appendChild(selectList);

  //Create and append the options
  for (var i = 0; i < array.length; i++) {
      var option = document.createElement("option");
      option.value = array[i].account.addr;
      option.text = array[i].location.region;
      selectList.appendChild(option);
  }
}

function showVPNUsageStats() {
  console.log('inside get vpn usage');

  fetch(B_URL + '/vpn/usage', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      'account_addr': document.getElementById('account_addr').innerHTML
    })
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        console.log('vpn stats', response.usage);

        var vpnUsage = response.usage;

        var transactionsHtml = '';

        for (var i = 0; i < vpnUsage.length; i++) {
          var usage = vpnUsage[i];

          transactionsHtml += '<div class="row single-transaction-block">\
          <div class="col-4">\
            <b>Data Used: </b> ' + usage.used/(1024 * 1024) + 'MB <br>\
            <b>Total Cost: </b> ' + usage.amount + 'SENTs <br>';

          if (usage.is_payed) {
            transactionsHtml += '<b>Status: </b> Paid';
          } else {
            transactionsHtml += '<button class="btn" onclick="payVPNDue(' + usage.amount + ', \'' + usage.addr + '\')">Pay Now</button>';
          }

          transactionsHtml += '</div>\
          <div class="col-8">\
            <b>VPN address: </b> ' + usage.addr + ' <br>\
            <b>Date: </b> 2017-12-09 18:30 PM<br>\
            <b>Session Duration: </b> 180 Minutes<br>\
          </div>\
        </div>';
        }

        document.getElementById('wallethistory').innerHTML = transactionsHtml;
      } else {
        console.log('Error while fetching VPN usage', response);
      }
    });
  });
};

getVPNList();

function payVPNDue (amount, vpnAddr) {
  console.log(vpnAddr, amount);

  var vpnPaymentItem = {
    vpnAddress: vpnAddr,
    amount: amount
  };

  localStorage.setItem('vpnPaymentItem', JSON.stringify(vpnPaymentItem));

  sectionId = 'vpnusage';
  $('#wallethistory').hide();

  $('#vpn-usage-menu').click();

  $('#' + sectionId).show();
  $('#' + sectionId + ' section').show();

  $('#toAddress').val(vpnAddr);
  $('#amount').val(amount);
  $('#is_vpn').val(true);
}

function showMap () {
  console.log('inside showMap');
  $.mapael.prototype.isRaphaelBBoxBugPresent = function() {return false;};

  fetch(B_URL + '/vpn/list', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    }
  }).then(function (response) {
    response.json().then(function (response) {
      if (response.success === true) {
        var plots = {};
        
        response.list.forEach(function(server) {
          console.log(server);
          plots[server['location']['region']] = {
              type: "circle",
              size: 10,
              latitude: server['location']['latitude'],
              longitude: server['location']['longitude'],
              attrs: {
                  opacity: 1
              },
              tooltip: {content: "<span style=\"font-weight:bold;\">City :</span>" + server['location']['region'] + "<br /> Speed: "+ Number((server['net_speed']['download'] / (1024 * 1024)).toFixed(2)) + " MBPS"},
              text: {
                  content: "",
                  position: "inner",
                  attrs: {
                      "font-size": 12
                      , "font-weight": "bold"
                      , fill: "#000"
                  },
                  attrsHover: {
                      "font-size": 12
                      , "font-weight": "bold"
                      , fill: "#000"
                  }
              }
          }
        });
        
          $("#world-map-markers").mapael({
            map: {
              name: "world_countries"
              // Set default plots and areas style
              , defaultPlot: {
                  attrs: {
                      fill: "#004a9b"
                      , opacity: 0.6
                  }
                  , attrsHover: {
                      opacity: 1
                  }
                  , text: {
                      attrs: {
                          fill: "#505444"
                      }
                      , attrsHover: {
                          fill: "#000"
                      }
                  }
              }
              , defaultArea: {
                  attrs: {
                      fill: "#f4f4e8"
                      , stroke: "#ced8d0"
                  }
                  , attrsHover: {
                      fill: "#a4e100"
                  }
                  , text: {
                      attrs: {
                          fill: "#505444"
                      }
                      , attrsHover: {
                          fill: "#000"
                      }
                  }
              }
          },

          // Customize some areas of the map
          areas: {
              "department-56": {
                  text: {content: "Morbihan", attrs: {"font-size": 10}},
                  tooltip: {content: "<b>Morbihan</b> <br /> Bretagne"}
              },
              "department-21": {
                  attrs: {
                      fill: "#488402"
                  }
                  , attrsHover: {
                      fill: "#a4e100"
                  }
              }
          },

          // Add some plots on the map
          plots: plots
          });
      }
    });
  });
}
