
import { sendError } from './../Actions/authentication.action';
import lang from './../Constants/language';

const fs = window.require('fs');
const electron = window.require('electron');
const remote = electron.remote;
const keythereum = require('keythereum');
const SENT_DIR = getUserHome() + '/.sentinel';

export const KEYSTORE_FILE = SENT_DIR + '/keystore';

function getUserHome() {
    return remote.process.env[(remote.process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

export const uploadKeystore = (keystore, cb) => {
    try {
        cb(null, createFile(KEYSTORE_FILE, keystore))
    } catch (Err) {
        sendError(Err);
    }
}

export function getPrivateKey(password, language, cb) {
    readFile(KEYSTORE_FILE, function (err, data) {
        if (err) cb(err, null);
        else {
            var keystore = JSON.parse(data)
            try {
                var privateKey = keythereum.recover(password, keystore);
                cb(null, privateKey);
            }
            catch (err) {
                cb({ message: lang[language].KeyPassMatch }, null);
            }
        }
    })
}

export function getPrivateKeyWithoutCallback(password, cb) {
    console.log(KEYSTORE_FILE)
    readFile(KEYSTORE_FILE, function (err, data) {
        if (err) cb(err, null);
        else {
            var keystore = JSON.parse(data)
            try {
                var privateKey = keythereum.recover(password, keystore);
                console.log(privateKey,'in get')
                cb(null, privateKey);
            }
            catch (err) {
                cb({ message: lang['en'].KeyPassMatch }, null);
            }
        }
    })
}

export function createFile(KEYSTORE_FILE, keystore) {
    fs.writeFile(KEYSTORE_FILE, keystore, function (err) {
        if (err) {
            return (err, null);
        } else {
            return KEYSTORE_FILE
        }
    });
}

export function readFile(KEYSTORE_FILE, cb) {
    try {
        fs.readFile(KEYSTORE_FILE, 'utf8', function (err, data) {
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