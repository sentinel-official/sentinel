import axios from 'axios';
import { CONNECT_VPN } from '../Constants/action.names';
import { checkDependencies, getOVPNAndSave, getUserHome, getOVPNTM } from '../Utils/utils';
import { getVPNPIDs } from '../Utils/VpnConfig';
import { getConfig } from '../Utils/UserConfig';
import { B_URL } from './../Constants/constants';
const electron = window.require('electron');
const remote = electron.remote;
const sudo = remote.require('sudo-prompt');
const SENT_DIR = getUserHome() + '/.sentinel';
const CONFIG_FILE = SENT_DIR + '/config';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
const fs = window.require('fs');
let async = window.require('async');
const { exec, execSync } = window.require('child_process');
let connect = {
    name: 'ConnectOpenVPN'
};
let OVPNDelTimer = null;
let CONNECTED = false;
let count = 0;

export async function connectVPN(account_addr, vpn_addr, os, data, cb) {
    checkVPNDependencies(os, (otherErr, winErr) => {
        if (otherErr) cb(otherErr, false, null);
        else if (winErr) cb(null, winErr, null);
        else {
            if (localStorage.getItem('isTM') === 'true') {
                tmConnect(account_addr, vpn_addr, data, (err, res) => {
                    cb(err, false, res)
                });
            }
            else {
                testConnect(account_addr, vpn_addr, (err, res) => {
                    cb(err, false, res)
                });
            }
        }
    })
    // switch (os) {
    //     case 'win32':
    //         checkOpenvpn((error) => {
    //             if (error) cb(null, error, null);
    //             else {

    //             }
    //         })
    //         break;

    //     case 'darwin':
    //         checkMacDependencies((err) => {
    //             if (err) cb(err, false, null);
    //             else {
    //                 if (localStorage.getItem('isTM') === 'true') {
    //                     tmConnect(account_addr, vpn_addr, data, (err, res) => {
    //                         cb(err, false, res)
    //                     });
    //                 }
    //                 else {
    //                     testConnect(account_addr, vpn_addr, (err, res) => {
    //                         cb(err, false, res)
    //                     });
    //                 }
    //             }
    //         })
    //     case 'linux': {
    //         checkDependencies(['openvpn'], (e, o, se) => {
    //             if (o) {
    //                 if (localStorage.getItem('isTM') === 'true') {
    //                     tmConnect(account_addr, vpn_addr, data, (err, res) => {
    //                         cb(err, false, res)
    //                     });
    //                 }
    //                 else {
    //                     testConnect(account_addr, vpn_addr, (err, res) => {
    //                         cb(err, false, res)
    //                     });
    //                 }
    //             } else {
    //                 console.log("dependecy error")
    //             }
    //         });
    //         break;
    //     }
    //     default: {
    //         break;
    //     }
    // }
}

export async function checkVPNDependencies(os, cb) {
    switch (os) {
        case 'win32': {
            checkOpenvpn((error) => {
                if (error) cb(null, error);
                else cb(null, null);
            })
            break;
        }
        case 'darwin': {
            checkMacDependencies((err) => {
                if (err) cb(err, null);
                else cb(null, null);
            })
            break;
        }
        case 'linux': {
            checkDependencies(['openvpn'], (e, o, se) => {
                if (o) cb(null, null);
                else cb({ message: 'Openvpn is not installed.' }, null);
            })
            break;
        }
        default: {
            cb({ message: "Can't detect current os platform." }, null)
            break;
        }
    }
}

export async function checkOpenvpn(cb) {
    exec('cd c:\\Program Files && IF EXIST OpenVPN (cd OpenVPN && dir openvpn.exe /s /p | findstr "openvpn")', function (err, stdout, stderr) {
        if (stdout.toString() === '') {
            exec('cd c:\\Program Files (x86) && IF EXIST OpenVPN (cd OpenVPN && dir openvpn.exe /s /p | findstr "openvpn")', function (error, stdout1, stderr1) {
                if (stdout.toString() === '') {
                    cb({ message: 'Openvpn not installed' });
                }
                else {
                    cb(null)
                }
            })
        } else {
            cb(null);
        }
    })
}

export async function testConnect(account_addr, vpn_addr, cb) {
    let data = {
        account_addr: account_addr,
        vpn_addr: vpn_addr
    };
    axios.post(`${B_URL}/client/vpn`, data)
        .then(resp => {
            if (resp.data.success) {
                getOVPNAndSave(account_addr, resp.data['ip'], resp.data['port'], resp.data['vpn_addr'], resp.data['token'], (err) => {
                    if (err) cb(err, null);
                    else connectwithOVPN(resp.data, cb);
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

export async function tmConnect(account_addr, vpn_data, session_data, cb) {
    getOVPNTM(account_addr, vpn_data, session_data, (err) => {
        if (err) cb(err, null);
        else {
            let resp = {
                success: true,
                message: 'Connected to VPN'
            }
            connectwithOVPN(resp, cb);
        }
    })
}

export function connectwithOVPN(resp, cb) {
    let command;
    if (remote.process.platform === 'darwin') {
        let ovpncommand = 'export PATH=$PATH:/usr/local/opt/openvpn/sbin && openvpn ' + OVPN_FILE;
        command = `/usr/bin/osascript -e 'do shell script "${ovpncommand}" with administrator privileges'`
    } else if (remote.process.platform === 'win32') {
        command = 'resources\\extras\\bin\\openvpn.exe ' + OVPN_FILE;
    } else {
        command = 'sudo openvpn ' + OVPN_FILE;
    }
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
    } else {
        exec(command, function (err, stdout, stderr) {
            console.log('Err...', err, 'Stdout..', stdout, 'Stderr..', stderr)
            OVPNDelTimer = setTimeout(function () {
                fs.unlinkSync(OVPN_FILE);
            }, 1000);
        });
    } // internal else ends here
    // setTimeout(function () {
    CONNECTED = false;
    count = 0;
    if (remote.process.platform === 'win32') { checkWindows(resp, cb) }
    else if (remote.process.platform === 'darwin') checkVPNConnection(resp, cb);
    else {
        getVPNPIDs((err, pids) => {
            if (err) { }
            else {
                CONNECTED = true;
                writeConf('openvpn', (res) => {
                    cb(null, resp.message);
                });
            }
        })
    }
}

function checkWindows(resp, cb) {
    exec('tasklist /v /fo csv | findstr /i "openvpn.exe"', function (err, stdout, stderr) {
        if (stdout.toString() === '') { }
        else {
            CONNECTED = true;
            writeConf('openvpn', (res) => {
                cb(null, resp.message);
                count = 4;
            });
        }
        count++;
        if (count < 4) {
            setTimeout(() => { checkWindows(resp, cb); }, 5000);
        }
        if (count === 4 && CONNECTED === false) {
            cb({ message: 'Something went wrong.Please Try Again' }, null);
        }
    })
}

export function writeConf(type, cb) {
    getConfig(function (err, confdata) {
        let data = confdata ? JSON.parse(confdata) : {};
        data.isConnected = true;
        data.ipConnected = localStorage.getItem('IPGENERATED');
        data.location = localStorage.getItem('LOCATION');
        data.speed = localStorage.getItem('SPEED');
        data.connectedAddr = localStorage.getItem('CONNECTED_VPN');
        data.session_name = localStorage.getItem('SESSION_NAME');
        data.vpn_type = type;
        let config = JSON.stringify(data);
        fs.writeFile(CONFIG_FILE, config, (err) => {
            cb(null)
        });
    })
}

function checkVPNConnection(resp, cb) {
    getVPNPIDs(async function (err, pids) {
        if (err) { }
        else {
            CONNECTED = true;
            writeConf('openvpn', (res) => {
                cb(null, resp.message);
                count = 2;
            });
        }

        getOsascriptIDs(function (ERr, pid) {
            if (ERr) count++;
        })

        if (count < 2) {
            setTimeout(function () { checkVPNConnection(resp, cb); }, 5000);
        }
        if (count == 2 && CONNECTED === false) {
            cb({ message: 'Something went wrong.Please Try Again' }, null)
        }
    });
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

export function checkMacDependencies(cb) {
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

export function isPackageInstalled(packageName, cb) {
    exec(`export PATH=$PATH:/usr/local/opt/openvpn/sbin && which ${packageName}`,
        function (err, stdout, stderr) {
            console.log("Installed or not..", err, stdout, stderr);
            if (err || stderr) {
                cb(null, false);
            }
            else {
                var brewPath = stdout.trim();
                if (brewPath.length > 0) cb(null, true);
                else cb(null, false);
            }
        });
}

export function installPackage(packageName, cb) {
    exec(`brew install ${packageName}`,
        function (err, stdout, stderr) {
            console.log("Installing: ", packageName, err, stdout, stderr);
            if (err || stderr) cb(err || stderr, false);
            else cb(null, true);
        });
}