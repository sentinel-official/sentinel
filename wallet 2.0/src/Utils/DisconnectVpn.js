import { getUserHome } from './utils';
import { getVPNPIDs, getVPNProcesses } from './VpnConfig';
import { getConfig } from './UserConfig';
const fs = window.require('fs');
const electron = window.require('electron');
const { exec } = window.require('child_process');
const remote = electron.remote;
const SENT_DIR = getUserHome() + '/.sentinel';
const CONFIG_FILE = SENT_DIR + '/config';
var sudo = remote.require('sudo-prompt');
var disconnect = {
    name: 'DisconnectOpenVPN'
};

export async function disconnectVPN(cb) {
    if (remote.process.platform === 'win32') {
        disconnectVPNWin((res) => { cb(res) });
    }
    else {
        disconnectVPNNonWin((res) => { cb(res) });
    }
}

export async function disconnectVPNWin(cb) {
    getVPNProcesses(function (err, pids) {
        if (err) cb({ message: 'Disconnecting failed' });
        else {
            sudo.exec('taskkill /IM openvpn.exe /f', disconnect,
                async function (error, stdout, stderr) {
                    if (error) cb({ message: error.toString() || 'Disconnecting failed' });
                    else {
                        removeItemsLocal();
                        clearConfig();
                        cb(null);
                    }
                });
        }
    })
}

export async function disconnectVPNNonWin(cb) {
    getVPNPIDs(function (err, pids) {
        if (err) cb(err);
        else {
            var command = 'kill -2 ' + pids;
            if (remote.process.platform === 'darwin') {
                command = `/usr/bin/osascript -e 'do shell script "${command}" with administrator privileges'`
            }
            exec(command, async function (error, stdout, stderr) {
                if (error) {
                    cb({ message: error.toString() || 'Disconnecting failed' })
                }
                else {
                    removeItemsLocal();
                    clearConfig();
                    cb(null);
                }
            });
        }
    })
}

export function removeItemsLocal() {
    localStorage.removeItem('IPGENERATED');
    localStorage.removeItem('LOCATION');
    localStorage.removeItem('SPEED');
}

export function removeSessionLocal() {
    localStorage.removeItem('SESSION_NAME');
    localStorage.removeItem('CONNECTED_VPN');
}

export async function clearConfig() {
    getConfig(function (err, confdata) {
        let newData = {};
        let data = confdata ? JSON.parse(confdata) : {};
        newData.isConnected = null;
        newData.connectedAddr = null;
        let keystore = JSON.stringify(newData);
        fs.writeFile(CONFIG_FILE, keystore, function (err) {
        });
    })
}