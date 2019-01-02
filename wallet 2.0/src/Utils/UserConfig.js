import { sendError } from './../Actions/authentication.action';
import { getUserHome } from './utils';
const fs = window.require('fs');
const { exec } = window.require('child_process');
const SENT_DIR = getUserHome() + '/.sentinel';
const CONFIG_FILE = SENT_DIR + '/config';

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

export function getConfig(cb) {
    fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
        if (err) {
            err.toString().includes('ENOENT') ?
                fs.writeFile(CONFIG_FILE, JSON.stringify({ isConnected: false }), function (Er) { })
                : null
            cb(err, null);
        }
        else {
            cb(null, data);
        }
    });
}

export function setTMConfig(username) {
    getConfig(function (error, configData) {
        let data = JSON.parse(configData);
        data.tmUserName = username;
        let config = JSON.stringify(data);
        fs.writeFile(CONFIG_FILE, config, function (keyErr) {
        });
    })
}