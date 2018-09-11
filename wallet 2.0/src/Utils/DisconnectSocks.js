import { getUserHome } from './utils';
import { getSocksPIDs } from './VpnConfig';
import { getConfig } from './UserConfig';
import { sendUsage } from './../Actions/calculateUsage';
import { clearConfig, removeItemsLocal } from './DisconnectVpn';
const electron = window.require('electron');
const { exec } = window.require('child_process');
const remote = electron.remote;
var sudo = remote.require('sudo-prompt');
var disconnect = {
    name: 'DisconnectSocks'
};

export async function disconnectSocks(account_addr, cb) {
    if (remote.process.platform === 'win32') {
        await disconnectSocksWin(account_addr, (res) => { cb(res) });
    }
    else {
        await disconnectSoclsNonWin(account_addr, (res) => { cb(res) });
    }
}

export async function disconnectSocksWin(addr, cb) {
    let cmd1 = 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /f /v ProxyEnable /t REG_DWORD /d 0';
    exec(`net stop sentinelSocks`, disconnect,
        async function (error, stdout, stderr) {
            if (error) cb({ message: error.toString() || 'Disconnecting failed' });
            else {
                sendUsage(addr, null);
                setTimeout(() => {
                    removeItemsLocal();
                    await clearConfig();
                    exec(cmd1, function (stderr, stdout, error) {
                        cb(null);
                    })
                }, 1000);
            }
        });
}

export async function disconnectSocksNonWin(addr, cb) {
    getSocksPIDs(function (err, pids) {
        if (err) cb(err);
        else {
            var command = 'kill -2 ' + pids;
            if (remote.process.platform === 'darwin') {
                command = `/usr/bin/osascript -e 'do shell script "${command}" with administrator privileges'`;
            }
            exec(command, async function (error, stdout, stderr) {
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
                                    sendUsage(addr, null);
                                    setTimeout(() => {
                                        removeItemsLocal();
                                        await clearConfig();
                                        cb(null);
                                    }, 1000);
                                })
                            }
                            else {
                                sendUsage(addr, null);
                                setTimeout(() => {
                                    removeItemsLocal();
                                    await clearConfig();
                                    cb(null);
                                }, 1000);
                            }
                        })
                    }
                    else {
                        sendUsage(addr, null);
                        setTimeout(() => {
                            removeItemsLocal();
                            await clearConfig();
                            cb(null);
                        }, 1000);
                    }
                }
            });
        }
    })
}