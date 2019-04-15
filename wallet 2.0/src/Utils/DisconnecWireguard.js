import { getUserHome, disConnectWireguard } from './utils';
import { getTMConfig } from './UserConfig';
const fs = window.require('fs');
const { exec } = window.require('child_process');
const SENT_DIR = getUserHome() + '/.sentinel';
const CONFIG_FILE = SENT_DIR + '/config';

export async function disconnectWireguard(cb) {

    exec(`wg-quick down wg0`, async function (error, stdout, stderr) {
        console.log("disconnecting local Wireguard...")
        if (error) {
            console.log("err to string ", error.toString())
            cb({ message: error.toString() || 'Disconnecting failed' })
        }
        else {

            removeItemsLocal();
            clearConfig();
            cb(null);
            disConnectWireguard(localStorage.getItem("TOKEN"), (err, res) => {
                if (err) throw err;
            })
        }
    });
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
    getTMConfig(function (err, confdata) {
        let newData = {};
        let data = confdata ? JSON.parse(confdata) : {};
        newData.isConnected = null;
        newData.connectedAddr = null;
        let keystore = JSON.stringify(newData);
        fs.writeFile(CONFIG_FILE, keystore, function (err) {
        });
    })
}