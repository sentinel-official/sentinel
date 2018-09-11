import axios from 'axios';
import { axiosInstance } from '../Actions/AxiosGlobalConfig';
import { B_URL } from '../Constants/constants'
import { calculateUsage } from "./calculateUsage";
import { installPackage, isPackageInstalled, writeConf } from './connectOVPN';
import { getUserHome } from '../Utils/utils';
import { getSocksPIDs, getSocksProcesses } from '../Utils/VpnConfig';

let async = window.require('async');
const fs = window.require('fs');
const electron = window.require('electron');
const remote = electron.remote;
const { exec } = window.require('child_process');
let CONNECTED = false;
let count = 0;

export async function connectSocks(account_addr, vpn_addr, os, cb) {
    switch (os) {
        case 'win32':
            checksentinelSocks(async (error) => {
                await socksConnect(account_addr, vpn_addr, (err, res) => {
                    cb(err, res)
                });
            })
            break;

        case 'darwin':
            checkMacDependencies(async (err) => {
                if (err) cb(err, null);
                else {
                    await socksConnect(account_addr, vpn_addr, (err, res) => {
                        cb(err, res)
                    });
                }
            })
        case 'linux':
            await socksConnect(account_addr, vpn_addr, (err, res) => {
                cb(err, res)
            });
            break;
        default: {
            break;
        }
    }
}

function checkMacDependencies(cb) {
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
            cb(error);
        }
        else {
            cb(null);
        }
    })
}

export async function checksentinelSocks(cb) {
    exec("net start sentinelSocks", function (stderr, stdout, error) {
        if (stderr && stderr.toString().trim().split(" ")[9] === 'already') {
            cb(null);
        } else if (stdout.toString().trim().split(" ")[8] === 'started') {
            cb(null);
        } else {
            let username = getUserHome();
            exec(`${username}\\AppData\\Local\\Sentinel\\app-0.0.51\\resources\\extras\\socks5\\service.exe`, function (execErr, execOut, execStd) {
                exec(`net start sentinelSocks`, function (stderr, stdout, error) {
                    cb(null);
                });
            });
        }
    });
}

export async function socksConnect(account_addr, vpn_addr, cb) {
    let data = {
        account_addr: account_addr,
        vpn_addr: vpn_addr
    };
    axios.post(`${B_URL}/client/vpn`, data)
        .then(resp => {
            if (resp.data.success) {
                getSocksCreds(account_addr, resp.data['ip'], resp.data['port'], resp.data['vpn_addr'], resp.data['token'], function (err, data) {
                    if (err) cb(err, null);
                    else connectwithSocks(data, cb);
                })
            } else {
                if (resp.data.account_addr)
                    cb(resp.data, null);
                else
                    cb({ message: resp.data.message || 'Connecting VPN Failed. Please Try Again' }, null);
            }
        })
        .catch(err => { cb({ message: err.response || 'Something wrong. Please Try Again.' }, null) })

}

export function connectwithSocks(data, cb) {
    if (remote.process.platform === 'win32') {
        fs.readFile('resources\\extras\\socks5\\gui-config.json', 'utf8', async function (err, conf) {
            if (err) { }
            else {
                var configData = JSON.parse(conf);
                configData.configs[0].server = data['ip'];
                configData.configs[0].server_port = data['port'];
                configData.configs[0].password = data['password'];
                configData.configs[0].method = data['method'];
                configData.global = true;
                var config = JSON.stringify(configData);
                await fs.writeFile('resources\\extras\\socks5\\gui-config.json', config, function (writeErr) {
                    exec('net start sentinelSocks', function (servErr, serveOut, serveStd) {
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
                    var currentService = stdout.trim();
                    exec(`networksetup -setsocksfirewallproxy '${currentService}' localhost 1080 && networksetup -setsocksfirewallproxystate '${currentService}' on`, function (error, Stdout, Stderr) {
                    })
                }
                if (err) { }
            })
        }
    }
    CONNECTED = false;
    count = 0;
    if (remote.process.platform === 'win32') checkSocksWindows();
    else {
        getSocksPIDs(async function (err, pids) {
            if (err) { }
            else {
                CONNECTED = true;
                await writeConf('socks5');
                cb(null, 'Connected to Socks');
            }
        });
    }
}

function checkSocksWindows(resp, cb) {
    getSocksProcesses(async function (err, pids) {
        if (err) { }
        else {
            CONNECTED = true;
            await writeConf('socks5');
            let cmd1 = 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /f /v ProxyEnable /t REG_DWORD /d 1';
            let cmd2 = 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /f /v ProxyServer /t REG_SZ /d 127.0.0.1:1080';
            exec(`${cmd1} && ${cmd2}`, function (stderr, stdout, error) {
                cb(null, 'Connected to Socks');
                count = 4;
            });
        }
        count++;
        if (count < 4) {
            setTimeout(function () { checkSocksWindows(); }, 5000);
        }
        if (count == 4 && CONNECTED === false) {
            cb({ message: 'Something went wrong.Please Try Again' }, null);
        }
    })
}

export function getSocksCreds(account_addr, vpn_ip, vpn_port, vpn_addr, nonce, cb) {
    let uri = `http://${vpn_ip}:${vpn_port}/creds`;
    let data = {
        'account_addr': account_addr,
        'vpn_addr': vpn_addr,
        'token': nonce
    };

    axios.post(uri, data)
        .then(response => {
            if (response.data.success) {
                localStorage.setItem('SESSION_NAME', response.data['session_name']);
                localStorage.setItem('CONNECTED_VPN', vpn_addr);
                localStorage.setItem('IPGENERATED', response.data['node']['vpn']['config']['ip']);
                localStorage.setItem('LOCATION', response.data['node']['location']['city']);
                localStorage.setItem('SPEED', Number(response.data['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + ' mbps');
                localStorage.setItem('VPN_TYPE', 'SOCKS5');
                cb(null, response.data['node']['vpn']['config']);
            }
            else {
                cb({ message: response.data.message || 'Error occurred while getting SOCKS5 credentials' }, null);
            }
        })
}
