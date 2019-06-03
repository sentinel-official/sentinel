import { sendError } from './../Actions/authentication.action';
import { getUserHome } from './utils';
import { dark } from '@material-ui/core/styles/createPalette';
const fs = window.require('fs');
const { exec, execSync } = window.require('child_process');
const SENT_DIR = getUserHome() + '/.sentinel';
const CONFIG_FILE = SENT_DIR + '/config';
const TM_CONFIG_FILE = SENT_DIR + '/tmConfig';
const WIREGUARD_CONFIG_FILE = SENT_DIR + '/wg0.conf';
const PK_FILE = SENT_DIR + '/privateKeyFile'



export const isOnline = function () {
    try {
        if (window.navigator.onLine) {
            return true
        } else {
            return false
        }
    } catch (Err) {
        sendError(Err);
    }
}

export function getConfig(cb) {
    fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
        if (err) {
            err.toString().includes('ENOENT') ?
                fs.writeFileSync(CONFIG_FILE, JSON.stringify({ isConnected: false }))
                : null
            cb(err, null);
        }
        else {
            cb(null, data);
        }
    });
}

export function getTMConfig(cb) {
    fs.readFile(TM_CONFIG_FILE, 'utf8', function (err, data) {
        if (err) {
            err.toString().includes('ENOENT') ?
                fs.writeFileSync(TM_CONFIG_FILE, JSON.stringify({ tmUserName: null, accounts: [] }))
                : null
            cb(err, null);
        }
        else {
            let configData = data ? JSON.parse(data) : { tmUserName: null, accounts: [] };
            if (configData.tmUserName && !(configData.accounts)) {
                configData.accounts = [configData.tmUserName];
                data = JSON.stringify(configData);
                fs.writeFileSync(TM_CONFIG_FILE, data);
            }
            cb(null, data);
        }
    });
}

export function getWireguardKeys(cb) {
    let pk = '', pubg = '';

    exec('wg genkey', function (err, stdout, stderr) {
        if (err) { console.log("normal1 err") }
        if (stdout) {
            pk = stdout
            // console.log("client private key ", pk)
            fs.writeFile('privateKeyFile', pk, function (err) {
                if (err) throw err;
                console.log('Saved!');
                exec('wg pubkey < privateKeyFile', function (a, b, c) {
                    if (a) throw a;
                    if (b) {
                        pubg = b;
                        localStorage.setItem("PUBG", pubg);
                        // console.log("client publick key ", pubg)
                    }
                })
            });
        }
        if (stderr) { console.log("stderr1", stderr) }
    })

}
export function setTMConfig(username, isNewAccount) {
    getTMConfig(function (error, configData) {
        let data = configData ? JSON.parse(configData) : {};
        data.tmUserName = username;
        // data.isCreated = true;
        if (isNewAccount) {
            data.accounts.push(username);
        }
        let config = JSON.stringify(data);
        fs.writeFileSync(TM_CONFIG_FILE, config);
    })
}

