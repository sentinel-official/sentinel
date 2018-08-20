import { getUserHome, getVPNPIDs } from './utils';
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
        await disconnectVPNWin((res) => { cb(res) });
    }
    else {
        await disconnectVPNNonWin((res) => { cb(res) });
    }
}

export async function disconnectVPNWin(cb) {
    sudo.exec('taskkill /IM openvpn.exe /f', disconnect,
        async function (error, stdout, stderr) {
            if (error) cb({ message: error.toString() || 'Disconnecting failed' });
            else {
                removeItemsLocal();
                await clearConfig();
                cb(null);
            }
        });
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
                    await clearConfig();
                    cb(null);
                }
            });
        }
    })
}

export function removeItemsLocal() {
    localStorage.removeItem('CONNECTED_VPN');
    localStorage.removeItem('IPGENERATED');
    localStorage.removeItem('LOCATION');
    localStorage.removeItem('SPEED');
    localStorage.removeItem('SESSION_NAME');
}

export async function clearConfig() {
    getConfig(async function (err, confdata) {
        let data = confdata ? JSON.parse(confdata) : {};
        data.isConnected = null;
        data.connectedAddr = null;
        let keystore = JSON.stringify(data);
        await fs.writeFile(CONFIG_FILE, keystore, function (err) {
        });
    })
}