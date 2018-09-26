import { getConfig } from './UserConfig';
const fs = window.require('fs');
const electron = window.require('electron');
const { exec, execSync } = window.require('child_process');
const remote = electron.remote;

export function getVPNPIDs(cb) {
    exec('pidof openvpn', function (err, stdout, stderr) {
        if (err) cb(true, null);
        else if (stdout) {
            let pids = stdout.trim();
            cb(null, pids);
        }
        else {
            cb(true, null);
        }
    });
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

export function getSocksProcesses(cb) {
    exec('tasklist /v /fo csv | findstr /i "Shadowsocks.exe"', function (err, stdout, stderr) {
        if (stdout.toString() === '') {
            cb(true, null)
        }
        else {
            cb(null, true)
        }
    })
}

export function getSocksPIDs(cb) {
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
}

export function isVPNConnected(cb) {
    if (remote.process.platform === 'win32') {
        if (localStorage.getItem('VPN_TYPE') === 'socks5') {
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
        if (localStorage.getItem('VPN_TYPE') === 'socks5') {
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
}

export function getVPNConnectedData(cb) {
    getConfig(function (error, data) {
        if (error) cb(true, null, false)
        else {
            let config = JSON.parse(data);
            if (config.isConnected) {
                let isSock = false;
                if (config.vpn_type === 'socks5') {
                    localStorage.setItem('VPN_TYPE', 'socks5');
                    isSock = true;
                }
                else localStorage.setItem('VPN_TYPE', 'openvpn');
                isVPNConnected(function (err, connected) {
                    if (connected) {
                        localStorage.setItem('IPGENERATED', config.ipConnected);
                        localStorage.setItem('LOCATION', config.location);
                        localStorage.setItem('SPEED', config.speed);
                        localStorage.setItem('SESSION_NAME', config.session_name);
                        localStorage.setItem('CONNECTED_VPN', config.connectedAddr);
                        let connectedData = {
                            ip: config.ipConnected,
                            location: config.location,
                            speed: config.speed,
                            vpn_addr: config.connectedAddr
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
}