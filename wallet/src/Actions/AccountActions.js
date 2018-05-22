const fs = window.require('fs');
var async = window.require('async');
const electron = window.require('electron');
const remote = electron.remote;
const { exec } = window.require('child_process');
const config = require('../config');
const B_URL = 'https://api.sentinelgroup.io';
var ETH_BALANCE_URL;
var SENT_BALANCE_URL;
var ETH_TRANSC_URL;
var SENT_TRANSC_URL1;
var TOKEN_BALANCE_URL;
var TRANSC_STATUS;
const SENT_TRANSC_URL2 = `&topic1_2_opr=or&topic2=`;
const SENT_DIR = getUserHome() + '/.sentinel';
const KEYSTORE_FILE = SENT_DIR + '/keystore';
const CONFIG_FILE = SENT_DIR + '/config';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
var getVPN = null;
var OVPNDelTimer = null;
var CONNECTED = false;
var SESSION_NAME = '';
var IPGENERATED = '';
var LOCATION = '';
var SPEED = '';
var ACCOUNT_ADDR = '';
var KEYSTOREDATA = '';
var CONNECTED_VPN = '';
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
  try {
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
  } catch (Err) {
    sendError(Err);
  }
}

export const uploadKeystore = (keystore, cb) => {
  try {
    fs.writeFile(KEYSTORE_FILE, keystore, function (err) {
      if (err) {
        sendError(err);
        cb(err);
      } else {
        cb(null);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export const checkKeystore = (cb) => {
  try {
    fs.readFile(KEYSTORE_FILE, 'utf8', function (err, data) {
      if (err) {
        sendError(err);
        cb(err);
      }
      else cb(null);
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getKeystore(cb) {
  try {
    fs.readFile(KEYSTORE_FILE, 'utf8', function (err, data) {
      if (err) {
        sendError(err);
        cb(err, null);
      }
      else {
        KEYSTOREDATA = data;
        cb(null, data);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getConfig(cb) {
  try {
    fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
      if (err) {
        sendError(err);
        cb(err, null);
      }
      else {
        cb(null, data);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function sendError(err) {
  if (err) {
    let error;
    if (typeof err === 'object')
      error = JSON.stringify(err);
    else error = err;
    let data = {
      'os': remote.process.platform + remote.process.arch,
      'account_addr': ACCOUNT_ADDR,
      'error_str': error
    }
    fetch(B_URL + '/logs/error', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }).then(function (res) {
      res.json().then(function (resp) {
      })
    })
  }
}

export function getAccount(cb) {
  try {
    getKeystore(function (err, data) {
      if (err) {
        cb(err, null);
      } else {
        data = JSON.parse(data);
        ACCOUNT_ADDR = '0x' + data.address;
        cb(null, ACCOUNT_ADDR);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function transferAmount(net, data, cb) {
  try {
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
            sendError(response.error);
            cb({ message: JSON.parse(response.error.error.split("'").join('"')).message || 'Error occurred while initiating transfer amount.' }, null);
          }
        })
      }
      else {
        cb({ message: response.message || 'Internal Server Error' }, null);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getTransactionStatus(tx_addr, cb) {
  try {
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
        if (response.status === "1") {
          var status = response['result']["status"];
          cb(null, true);
        } else cb({ message: 'Error occurred while getting balance.' }, false);
      })
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getSwapTransactionStatus(tx_addr, cb) {
  try {
    fetch(B_URL + '/tokens/swaps/status?tx_hash=' + tx_addr, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then(function (response) {
      response.json().then(function (response) {
        if (response.success) {
          var result = response['result'];
          cb(null, result);
        } else cb({ message: 'Error occurred while getting balance.' }, false);
      })
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function payVPNUsage(data, cb) {
  try {
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
          console.log("Transaction Response...", response)
          if (response.success === true) {
            var tx_hash = response['tx_hashes'][0];
            cb(null, tx_hash);
          } else {
            sendError(response.errors);
            if (response.errors.length > 0) {
              if (response.errors[0].error) {
                try {
                  cb({
                    message: JSON.parse(response.errors[0].error.split("'").join('"')).message || 'Something went wrong in transaction'
                  }, null);
                } catch (err) {
                  cb({
                    message: response.errors[0].error || 'Something went wrong in transaction'
                  }, null);
                }
              }
              else {
                cb({
                  message: JSON.parse(response.errors[0].split("'").join('"')).error
                    || 'Error occurred while initiating transfer amount.'
                }, null);
              }
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
  } catch (Err) {
    sendError(Err);
  }
}

export function getFreeAmount(account_addr, cb) {
  try {
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
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getVPNUsageData(account_addr, cb) {
  try {
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
  } catch (Err) {
    sendError(Err);
  }
}

export function sendUsage(account_addr, vpn_addr, usage) {
  let connections = [{
    'usage': usage,
    'client_addr': account_addr,
    'session_name': SESSION_NAME
  }
  ]
  fetch(B_URL + '/client/update-connection', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'account_addr': vpn_addr,
      'connections': connections
    })
  }).then(function (res) {
    res.json().then(function (resp) {
    })
  })
}

export function reportPayment(data, cb) {
  try {
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
          console.log("Res Report...", response)
          if (response.success === true) {
            var tx_hash = response['tx_hash'];
            cb(null, tx_hash);
          }
          else {
            sendError(response.error);
            cb({ message: JSON.parse(response.error.error.split("'").join('"')).message || 'Transaction Failed' }, null);
          }
        })
      }
      else {
        cb({ message: response.message || 'Internal Server Error' }, null);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getAvailableTokens(cb) {
  try {
    fetch(B_URL + '/tokens/available', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      }
    }).then(function (response) {
      if (response.status === 200) {
        response.json().then(function (response) {
          if (response.success === true) {
            cb(null, response.tokens);
          } else {
            cb({ message: 'Error occurred while getting available tokens.' }, null);
          }
        });
      }
      else {
        cb({ message: 'Server Error.Please Try Again' }, null);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getEthBalance(data, cb) {
  try {
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
  } catch (Err) {
    sendError(Err);
  }
}

export function getSentBalance(data, cb) {
  try {
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
  } catch (Err) {
    sendError(Err);
  }
}

export function getTokenBalance(contract, addr, decimals, cb) {
  try {
    if (localStorage.getItem('config') === 'TEST')
      TOKEN_BALANCE_URL = config.test.balanceUrl
    else
      TOKEN_BALANCE_URL = config.main.balanceUrl
    fetch(TOKEN_BALANCE_URL + contract + "&address=" + addr, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      }
    }).then(function (response) {
      response.json().then(function (response) {
        if (response.status === '1') {
          var balance = response['result'] / (10 ** (decimals));
          cb(null, balance);
        } else cb({ message: 'Error occurred while getting balance.' }, null);
      });
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function swapRawTransaction(data, cb) {
  try {
    fetch(B_URL + '/tokens/swaps/raw-transaction', {
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
            sendError(response.error);
            cb({ message: JSON.parse(response.error.error.split("'").join('"')).message || 'Error occurred while initiating transfer amount.' }, null);
          }
        })
      }
      else {
        cb({ message: response.message || 'Internal Server Error' }, null);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getSentValue(toAddr, value, cb) {
  try {
    fetch(B_URL + '/tokens/sents?to_addr=' + toAddr + '&value=' + value, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      }
    }).then(function (response) {
      response.json().then(function (resp) {
        if (resp.success === true) {
          var sents = resp['sents'] / (10 ** 8);
          cb(null, sents);
        } else cb({ message: 'Error occurred while getting balance.' }, null);
      });
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getEthTransactionHistory(account_addr, page, cb) {
  try {
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
  } catch (Err) {
    sendError(Err);
  }
}

function getOsascriptIDs(cb) {
  exec('pidof osascript', function (err, stdout, stderr) {
    if (err) cb(err, null);
    else if (stdout) {
      var pids = stdout.trim();
      cb(null, pids);
    }
    else {
      cb(true, null);
    }
  });
}

export function getSentTransactionHistory(account_addr, cb) {
  try {
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
  } catch (Err) {
    sendError(Err);
  }
}

export function getVpnHistory(account_addr, cb) {
  try {
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
  } catch (Err) {
    sendError(Err);
  }
}

export const getVPNList = (cb) => {
  try {
    let listUrl;
    if (localStorage.getItem('vpnType') === 'socks5')
      listUrl = B_URL + '/client/vpn/socks-list'
    else
      listUrl = B_URL + '/client/vpn/list'
    fetch(listUrl, {
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
  } catch (Err) {
    sendError(Err);
  }
}

function isPackageInstalled(packageName, cb) {
  try {
    exec(`export PATH=$PATH:/usr/local/opt/openvpn/sbin && which ${packageName}`,
      function (err, stdout, stderr) {
        console.log("Installed or not..", err, stdout, stderr);
        if (err || stderr) {
          sendError(err || stderr)
          cb(null, false);
        }
        else {
          var brewPath = stdout.trim();
          if (brewPath.length > 0) cb(null, true);
          else cb(null, false);
        }
      });
  } catch (Err) {
    sendError(Err);
  }
}

function installPackage(packageName, cb) {
  try {
    exec(`brew install ${packageName}`,
      function (err, stdout, stderr) {
        console.log("Installing ", packageName, err, stdout, stderr)
        if (err || stderr) cb(err || stderr, false);
        else cb(null, true);
      });
  } catch (Err) {
    sendError(Err);
  }
}

export function connectSocks(account_addr, vpn_addr, cb) {
  try {
    CONNECTED = false;
    if (remote.process.platform === 'darwin') {
      // var packageNames = ['brew', 'openvpn', 'pidof'];
      async.waterfall([
        function (callback) {
          isPackageInstalled('brew', function (err, isInstalled) {
            if (err) {
              callback({
                message: `Error occured while installing brew`
              });
            }
            else if (isInstalled) {
              callback(null);
            }
            else {
              callback({
                message: `Package Brew is not Installed`
              })
            }
          })
        },
        function (callback) {
          isPackageInstalled('ss-local', function (err, isInstalled) {
            if (err) {
              callback({
                message: `Error occured while installing shadowsocks-libev`
              });
            }
            else if (isInstalled) {
              callback(null);
            }
            else {
              installPackage('shadowsocks-libev', function (Err, success) {
                if (Err || success === false) {
                  sendError(Err)
                  callback({
                    message: `Error occurred while installing package: shadowsocks-libev`
                  });
                }
                else {
                  callback(null)
                }
              })
            }
          })
        },
        function (callback) {
          isPackageInstalled('pidof', function (err, isInstalled) {
            if (err) {
              callback({
                message: `Error occured while installing pidof`
              });
            }
            else if (isInstalled) {
              callback(null);
            }
            else {
              installPackage('pidof', function (Err, success) {
                if (Err || success === false) {
                  sendError(Err)
                  callback({
                    message: `Error occurred while installing package: pidof`
                  });
                }
                else {
                  callback(null)
                }
              })
            }
          })
        },
      ], function (error) {
        if (error) {
          sendError(error);
          cb(error, true, false, false, null);
        }
        else {
          nextStep();
        }
      })
    }
    else if (remote.process.platform === 'win32') {
      exec('cd c:\\ProgramData && IF EXIST chocolatey (echo "TRUE")', function (err, stdout, stderr) {
        if (stdout.toString() === '') {
          exec('IF EXIST Chocolatey (echo "TRUE")', function (error, stdout1, stderr1) {
            if (stdout1.toString() === '') {
              let cmd = `@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"`
              exec(cmd, function (instErr, instOut, instStdErr) {
                if (instErr) {
                  cb({ message: 'Choco Installation failed. Please install manually' }, false, true, false, null);
                }
                else {
                  checkNssm();
                }
              })
            }
            else {
              checkNssm();
            }
          })
        } else {
          checkNssm();
        }
      })
    }
    else {
      nextStep();
    }
    function checkNssm() {
      exec('choco install nssm -y', function (instaErr, instaOut, instDerr) {
        if (instaErr) {
          cb({ message: 'Problem faced working with nssm. Please restart sentinel app once.' }, false, true, false, null);
        }
        else {
          let username = getUserHome();
          exec(`nssm.exe install sentinelSocks ${username}\\AppData\\Local\\Sentinel\\app-0.0.4\\resources\\extras\\socks5\\socks5.exe`, function (execErr, execOut, execStd) {
            nextStep();
          })
        }
      })
    }
    function nextStep() {
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
            getSocksCreds(account_addr, res['ip'], res['port'], res['vpn_addr'], res['token'], function (err, data) {
              if (err) cb(err);
              else {
                if (remote.process.platform === 'win32') {
                  fs.readFile('resources\\extras\\socks5\\gui-config.json', 'utf8', function (err, conf) {
                    if (err) {
                      console.log("Err...", err)
                    }
                    else {
                      var configData = JSON.parse(conf);
                      configData.configs[0].server = data['ip'];
                      configData.configs[0].server_port = data['port'];
                      configData.configs[0].password = data['password'];
                      configData.configs[0].method = data['method'];
                      configData.global = true;
                      var config = JSON.stringify(configData);
                      fs.writeFile('resources\\extras\\socks5\\gui-config.json', config, function (writeErr) {
                        exec('net start sentinelSocks', function (servErr, serveOut, serveStd) {
                          console.log("Started...", servErr, serveOut, serveStd)
                        })
                      });
                    }
                  });
                }
                else {
                  exec('ss-local -s ' + data['ip'] + ' -m ' + data['method'] + ' -k ' + data['password'] + ' -p ' + data['port'] + ' -l 1080', function (err, stdout, stderr) {
                  })
                  if (remote.process.platform === 'darwin') {
                    let netcmd = `services=$(networksetup -listnetworkserviceorder | grep 'Hardware Port'); while read line; do sname=$(echo $line | awk -F  "(, )|(: )|[)]" '{print $2}'); sdev=$(echo $line | awk -F  "(, )|(: )|[)]" '{print $4}'); if [ -n "$sdev" ]; then ifout="$(ifconfig $sdev 2>/dev/null)"; echo "$ifout" | grep 'status: active' > /dev/null 2>&1; rc="$?"; if [ "$rc" -eq 0 ]; then currentservice="$sname"; currentdevice="$sdev"; currentmac=$(echo "$ifout" | awk '/ether/{print $2}'); fi; fi; done <<< "$(echo "$services")"; if [ -n "$currentservice" ]; then echo $currentservice; else >&2 echo "Could not find current service"; exit 1; fi`;
                    exec(netcmd, function (err, stdout, stderr) {
                      if (stdout) {
                        console.log("NEt Out...", stdout.toString())
                        var currentService = stdout.trim();
                        exec(`networksetup -setsocksfirewallproxy '${currentService}' localhost 1080 && networksetup -setsocksfirewallproxystate '${currentService}' on`, function (error, Stdout, Stderr) {
                        })
                      }
                      if (err) {
                        console.log("Error..", err);
                      }
                    })
                  }
                }
                var count = 0;
                if (remote.process.platform === 'win32') checkWindows();
                else {
                  setTimeout(function () {
                    getSocksPIDs(function (err, pids) {
                      if (err) cb({ message: err });
                      else {
                        CONNECTED = true;
                        let data = {};
                        data.isConnected = true;
                        data.ipConnected = IPGENERATED;
                        data.location = LOCATION;
                        data.speed = SPEED;
                        data.connectedAddr = CONNECTED_VPN;
                        data.vpn_type = 'socks5';
                        data.session_name = SESSION_NAME;
                        let keystore = JSON.stringify(data);
                        fs.writeFile(CONFIG_FILE, keystore, function (err) {
                        });
                        cb(null, false, false, false, SESSION_NAME);
                      }
                    });
                  }, 2000);
                }
                function checkWindows() {
                  getSocksProcesses(function (err, pids) {
                    if (err) { }
                    else {
                      CONNECTED = true;
                      let data = {};
                      data.isConnected = true;
                      data.ipConnected = IPGENERATED;
                      data.location = LOCATION;
                      data.speed = SPEED;
                      data.connectedAddr = CONNECTED_VPN;
                      data.vpn_type = 'socks5';
                      data.session_name = SESSION_NAME;
                      let keystore = JSON.stringify(data);
                      fs.writeFile(CONFIG_FILE, keystore, function (err) {
                      });
                      cb(null, false, false, false, SESSION_NAME);
                      count = 4;
                    }
                    count++;
                    if (count < 4) {
                      setTimeout(function () { checkWindows(); }, 5000);
                    }
                    if (count == 4 && CONNECTED === false) {
                      cb({ message: 'Something went wrong.Please Try Again' }, false, false, false, null)
                    }
                  })
                }
              }
            })
          }
          else {
            sendError(res);
            if (res.account_addr)
              cb({ message: res.message || 'Initial Payment is not done' }, false, false, res.account_addr, null);
            else
              cb({ message: res.message || 'Connecting VPN Failed.Please Try Again' }, false, false, false, null);
          }
        })
      })
    }
  } catch (Err) {
    sendError(Err);
  }
}

export function setStartValues(downVal, upVal) {
  fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
    if (err) {
    }
    else {
      var configData = JSON.parse(data);
      configData.startDown = downVal;
      configData.startUp = upVal;
      var config = JSON.stringify(configData);
      fs.writeFile(CONFIG_FILE, config, function (err) {
      });
    }
  });
}

export function getStartValues(cb) {
  fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
    if (err) {
      cb(0, 0);
    }
    else {
      var configData = JSON.parse(data);
      var downVal = configData.startDown ? configData.startDown : 0;
      var upVal = configData.startUp ? configData.startUp : 0;
      cb(downVal, upVal);
    }
  })
}

export function getSocksCreds(account_addr, vpn_ip, vpn_port, vpn_addr, nonce, cb) {
  fetch('http:' + vpn_ip + ':' + vpn_port + '/creds', {
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
          console.log("VPN Response..", response);
          SESSION_NAME = response['session_name'];
          CONNECTED_VPN = vpn_addr;
          IPGENERATED = response['node']['vpn']['config']['ip'];
          LOCATION = response['node']['location']['city'];
          SPEED = Number(response['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + ' Mbps';
          cb(null, response['node']['vpn']['config']);
        }
        else {
          sendError(response);
          cb({ message: response.message || 'Error occurred while getting OVPN file, may be empty VPN resources.' }, null);
        }
      })
    }
  })
}

export function disconnectSocks(cb) {
  if (remote.process.platform === 'win32') {
    exec('net stop sentinelSocks', disconnect,
      function (error, stdout, stderr) {
        if (error) cb({ message: error.toString() || 'Disconnecting failed' });
        else {
          CONNECTED = false;
          CONNECTED_VPN = null;
          let data = {};
          data.isConnected = null;
          data.connectedAddr = null;
          let keystore = JSON.stringify(data);
          fs.writeFile(CONFIG_FILE, keystore, function (err) {
          });
          cb(null);
        }
      });
  }
  else {
    getSocksPIDs(function (err, pids) {
      if (err) { cb(err) }
      else {
        var command = 'kill -2 ' + pids;
        if (remote.process.platform === 'darwin') {
          command = `/usr/bin/osascript -e 'do shell script "${command}" with administrator privileges'`
        }
        exec(command, function (error, stdout, stderr) {
          if (error) {
            cb({ message: error.toString() || 'Disconnecting failed' })
          }
          else {
            if (remote.process.platform === 'darwin') {
              let netcmd = `services=$(networksetup -listnetworkserviceorder | grep 'Hardware Port'); while read line; do sname=$(echo $line | awk -F  "(, )|(: )|[)]" '{print $2}'); sdev=$(echo $line | awk -F  "(, )|(: )|[)]" '{print $4}'); if [ -n "$sdev" ]; then ifout="$(ifconfig $sdev 2>/dev/null)"; echo "$ifout" | grep 'status: active' > /dev/null 2>&1; rc="$?"; if [ "$rc" -eq 0 ]; then currentservice="$sname"; currentdevice="$sdev"; currentmac=$(echo "$ifout" | awk '/ether/{print $2}'); fi; fi; done <<< "$(echo "$services")"; if [ -n "$currentservice" ]; then echo $currentservice; else >&2 echo "Could not find current service"; exit 1; fi`;
              exec(netcmd, function (comErr, stdoutput, stderror) {
                if (stdoutput) {
                  var currentService = stdoutput.trim();
                  exec(`networksetup -setsocksfirewallproxystate '${currentService}' off`, function (runError, Stdout, Stderr) {
                  })
                }
              })
            }
            CONNECTED = false;
            CONNECTED_VPN = null;
            let data = {};
            data.isConnected = null;
            data.connectedAddr = null;
            let keystore = JSON.stringify(data);
            fs.writeFile(CONFIG_FILE, keystore, function (err) {
            });
            cb(null);
          }
        });
      }
    });
  }
}

export function connectVPN(account_addr, vpn_addr, cb) {
  try {
    CONNECTED = false;
    if (remote.process.platform === 'darwin') {
      // var packageNames = ['brew', 'openvpn', 'pidof'];
      async.waterfall([
        function (callback) {
          isPackageInstalled('brew', function (err, isInstalled) {
            if (err) {
              callback({
                message: `Error occured while installing brew`
              });
            }
            else if (isInstalled) {
              callback(null);
            }
            else {
              callback({
                message: `Package Brew is not Installed`
              })
            }
          })
        },
        function (callback) {
          isPackageInstalled('openvpn', function (err, isInstalled) {
            if (err) {
              callback({
                message: `Error occured while installing openvpn`
              });
            }
            else if (isInstalled) {
              callback(null);
            }
            else {
              installPackage('openvpn', function (Err, success) {
                if (Err || success === false) {
                  sendError(Err)
                  callback({
                    message: `Error occurred while installing package: openvpn`
                  });
                }
                else {
                  callback(null)
                }
              })
            }
          })
        },
        function (callback) {
          isPackageInstalled('pidof', function (err, isInstalled) {
            if (err) {
              callback({
                message: `Error occured while installing pidof`
              });
            }
            else if (isInstalled) {
              callback(null);
            }
            else {
              installPackage('pidof', function (Err, success) {
                if (Err || success === false) {
                  sendError(Err)
                  callback({
                    message: `Error occurred while installing package: pidof`
                  });
                }
                else {
                  callback(null)
                }
              })
            }
          })
        },
      ], function (error) {
        if (error) {
          sendError(error);
          cb(error, true, false, false, null);
        }
        else {
          nextStep();
        }
      })
    }
    else if (remote.process.platform === 'win32') {
      exec('cd c:\\Program Files && IF EXIST OpenVPN (cd OpenVPN && dir openvpn.exe /s /p | findstr "openvpn")', function (err, stdout, stderr) {
        if (stdout.toString() === '') {
          exec('cd c:\\Program Files (x86) && IF EXIST OpenVPN (cd OpenVPN && dir openvpn.exe /s /p | findstr "openvpn")', function (error, stdout1, stderr1) {
            if (stdout.toString() === '') {
              cb({ message: 'false' }, false, true, false, null);
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
        var ovpncommand = 'export PATH=$PATH:/usr/local/opt/openvpn/sbin && openvpn ' + OVPN_FILE;
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
            getOVPNAndSave(account_addr, res['ip'], res['port'], res['vpn_addr'], res['token'], function (err) {
              if (err) cb(err, false, false, false, null);
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
                      if (err) cb({ message: err }, false, false, false, null);
                      else {
                        CONNECTED = true;
                        let data = {};
                        data.isConnected = true;
                        data.ipConnected = IPGENERATED;
                        data.location = LOCATION;
                        data.speed = SPEED;
                        data.connectedAddr = CONNECTED_VPN;
                        data.session_name = SESSION_NAME;
                        data.vpn_type = 'openvpn';
                        let keystore = JSON.stringify(data);
                        fs.writeFile(CONFIG_FILE, keystore, function (err) {
                        });
                        cb(null, false, false, false, res.message);
                      }
                    });

                  }, 1000);
                }
                function checkWindows() {
                  exec('tasklist /v /fo csv | findstr /i "openvpn.exe"', function (err, stdout, stderr) {
                    if (stdout.toString() === '') {
                    }
                    else {
                      CONNECTED = true;
                      let data = {};
                      data.isConnected = true;
                      data.ipConnected = IPGENERATED;
                      data.location = LOCATION;
                      data.speed = SPEED;
                      data.connectedAddr = CONNECTED_VPN;
                      data.session_name = SESSION_NAME;
                      data.vpn_type = 'openvpn';
                      let keystore = JSON.stringify(data);
                      fs.writeFile(CONFIG_FILE, keystore, function (err) {
                      });
                      cb(null, false, false, false, res.message);
                      count = 4;
                    }
                    count++;
                    if (count < 4) {
                      setTimeout(function () { checkWindows(); }, 5000);
                    }
                    if (count == 4 && CONNECTED === false) {
                      cb({ message: 'Something went wrong.Please Try Again' }, false, false, false, null)
                    }
                  })
                }
                function checkVPNConnection() {
                  getVPNPIDs(function (err, pids) {
                    if (err) { }
                    else {
                      CONNECTED = true;
                      let data = {};
                      data.isConnected = true;
                      data.ipConnected = IPGENERATED;
                      data.location = LOCATION;
                      data.connectedAddr = CONNECTED_VPN;
                      data.speed = SPEED;
                      data.vpn_type = 'openvpn';
                      data.session_name = SESSION_NAME;
                      let keystore = JSON.stringify(data);
                      fs.writeFile(CONFIG_FILE, keystore, function (err) {
                      });
                      cb(null, false, false, false, res.message);
                      count = 2;
                    }

                    getOsascriptIDs(function (ERr, pid) {
                      if (ERr) count++;
                    })

                    if (count < 2) {
                      setTimeout(function () { checkVPNConnection(); }, 5000);
                    }
                    if (count == 2 && CONNECTED === false) {
                      cb({ message: 'Something went wrong.Please Try Again' }, false, false, false, null)
                    }
                  });
                }
              }
            });
          }
          else {
            sendError(res);
            if (res.account_addr)
              cb({ message: res.message || 'Initial Payment is not done' }, false, false, res.account_addr, null);
            else
              cb({ message: res.message || 'Connecting VPN Failed.Please Try Again' }, false, false, false, null);
          }
        })
      })
    }
  } catch (Err) {
    sendError(Err);
  }
}

function getOVPNAndSave(account_addr, vpn_ip, vpn_port, vpn_addr, nonce, cb) {
  try {
    if (fs.existsSync(OVPN_FILE)) {
      cb(null);
    } else {
      fetch('http:' + vpn_ip + ':' + vpn_port + '/ovpn', {
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
              console.log("VPN Response..", response);
              if (response['node'] === null) {
                cb({ message: 'Something wrong. Please Try Later' })
              }
              else {
                if (remote.process.platform === 'win32' || remote.process.platform === 'darwin') {
                  delete (response['node']['vpn']['ovpn'][17]);
                  delete (response['node']['vpn']['ovpn'][18]);
                }
                var ovpn = response['node']['vpn']['ovpn'].join('');
                SESSION_NAME = response['session_name'];
                CONNECTED_VPN = vpn_addr;
                IPGENERATED = response['node']['vpn']['ovpn'][3].split(' ')[1];
                LOCATION = response['node']['location']['city'];
                SPEED = Number(response['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + ' Mbps';
                fs.writeFile(OVPN_FILE, ovpn, function (err) {
                  if (err) cb(err);
                  else cb(null);
                });
              }
            } else {
              sendError(response);
              cb({ message: response.message || 'Error occurred while getting OVPN file, may be empty VPN resources.' });
            }
          });
        }
        else {
          cb({ message: 'Server Error' })
        }
      });
    }
  } catch (Err) {
    sendError(Err);
  }
}

export function getVPNPIDs(cb) {
  try {
    exec('pidof openvpn', function (err, stdout, stderr) {
      if (err) cb(err, null);
      else if (stdout) {
        var pids = stdout.trim();
        cb(null, pids);
      }
      else {
        cb(true, null);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export function getSocksPIDs(cb) {
  try {
    exec('pidof ss-local', function (err, stdout, stderr) {
      if (err) cb(err, null);
      else if (stdout) {
        var pids = stdout.trim();
        cb(null, pids);
      }
      else {
        cb(true, null);
      }
    });
  } catch (Err) {
    sendError(Err);
  }
}

export const isOnline = function () {
  try {
    if (window.navigator.onLine) {
      return true
    }
    else {
      return false
    }
  } catch (Err) {
    sendError(Err);
  }
}

export function disconnectVPN(cb) {
  try {
    if (remote.process.platform === 'win32') {
      sudo.exec('taskkill /IM openvpn.exe /f', disconnect,
        function (error, stdout, stderr) {
          if (error) cb({ message: error.toString() || 'Disconnecting failed' });
          else {
            CONNECTED = false;
            CONNECTED_VPN = null;
            let data = {};
            data.isConnected = null;
            data.connectedAddr = null;
            let keystore = JSON.stringify(data);
            fs.writeFile(CONFIG_FILE, keystore, function (err) {
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
          exec(command, function (error, stdout, stderr) {
            if (error) {
              cb({ message: error.toString() || 'Disconnecting failed' })
            }
            else {
              CONNECTED = false;
              CONNECTED_VPN = null;
              let data = {};
              data.isConnected = null;
              data.connectedAddr = null;
              let keystore = JSON.stringify(data);
              fs.writeFile(CONFIG_FILE, keystore, function (err) {
              });
              cb(null);
            }
          });
        }
      });
    }
  } catch (Err) {
    sendError(Err);
  }
}

export function getVPNdetails(cb) {
  try {
    isVPNConnected(function (err, connected) {
      if (connected) {
        var data = {
          ip: IPGENERATED,
          location: LOCATION,
          speed: SPEED,
          vpn_addr: CONNECTED_VPN
        }
        if (CONNECTED) {
          cb(true, data);
        }
        else {
          cb(false, data);
        }
      } else {
        CONNECTED = false;
        cb(false, data);
      }
    })
  } catch (Err) {
    sendError(Err);
  }
}

export function getVPNProcesses(cb) {
  try {
    exec('tasklist /v /fo csv | findstr /i "openvpn.exe"', function (err, stdout, stderr) {
      if (stdout.toString() === '') {
        cb(true, null)
      }
      else {
        cb(null, true)
      }
    })
  } catch (Err) {
    sendError(Err);
  }
}

export function getSocksProcesses(cb) {
  try {
    exec('tasklist /v /fo csv | findstr /i "Shadowsocks.exe"', function (err, stdout, stderr) {
      if (stdout.toString() === '') {
        cb(true, null)
      }
      else {
        cb(null, true)
      }
    })
  } catch (Err) {
    sendError(Err);
  }
}

export function isVPNConnected(cb) {
  try {
    if (remote.process.platform === 'win32') {
      if (localStorage.getItem('vpnType') === 'socks5') {
        getSocksProcesses(function (err, pid) {
          if (err) {
            cb(err, false)
          } else {
            cb(null, true)
          }
        });
      }
      else {
        getVPNProcesses(function (err, pid) {
          if (err) {
            cb(err, false)
          } else {
            cb(null, true)
          }
        });
      }
    }
    else {
      if (localStorage.getItem('vpnType') === 'socks5') {
        getSocksPIDs(function (err, pids) {
          if (err) {
            cb(err, null)
          } else if (pids) {
            cb(null, true)
          } else {
            cb(true, false)
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
  } catch (Err) {
    sendError(Err);
  }
}

export function getLatency(url, cb) {
  try {
    if (remote.process.platform == 'win32') {
      exec("ping -n 2 " + url + " | findstr /i \"average\"", function (err, stdout, stderr) {
        if (err) {
          sendError(err);
          cb(err, null)
        }
        else cb(null, stdout.toString().split(',')[2].split('=')[1].split('ms')[0]);
      })
    }
    else {
      exec("ping -c 2 " + url + " | tail -1 | awk '{print $4}' | cut -d '/' -f 2", function (err, stdout, stderr) {
        if (err) {
          sendError(err);
          cb(err, null);
        }
        else cb(null, stdout.toString())
      })
    }
  } catch (Err) {
    sendError(Err);
  }
}

export function getVPNConnectedData(cb) {
  try {
    getConfig(function (error, data) {
      if (error) cb(true, null, false)
      else {
        let keystore = JSON.parse(data);
        if (keystore.isConnected) {
          let isSock = false;
          if (keystore.vpn_type === 'socks5') {
            localStorage.setItem('vpnType', 'socks5');
            isSock = true;
          }
          else localStorage.setItem('vpnType', 'openvpn');
          isVPNConnected(function (err, connected) {
            if (connected) {
              CONNECTED = true;
              IPGENERATED = keystore.ipConnected;
              LOCATION = keystore.location;
              SPEED = keystore.speed;
              SESSION_NAME = keystore.session_name;
              CONNECTED_VPN = keystore.connectedAddr;
              let connectedData = {
                ip: IPGENERATED,
                location: LOCATION,
                speed: SPEED,
                vpn_addr: CONNECTED_VPN
              }
              cb(null, connectedData, isSock)
            }
            else {
              cb(true, null, false)
            }
          })
        }
        else {
          cb(true, null, false);
        }
      }
    })
  } catch (Err) {
    sendError(Err);
  }
}