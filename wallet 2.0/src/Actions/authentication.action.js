
import { B_URL } from './../Constants/constants';
import * as types from './../Constants/action.names';
import * as URL from './../Constants/api.routes'
import { readFile } from './../Utils/Keystore';
import axios from 'axios';

const keythereum = require('keythereum');
const electron = window.require('electron');
const remote = electron.remote;
const SENT_DIR = getUserHome() + '/.sentinel';
var ACCOUNT_ADDR = '';
var lang = require('./../Constants/language');

export const KEYSTORE_FILE = SENT_DIR + '/keystore';

function getUserHome() {
    return remote.process.env[(remote.process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

export function sendError(err) {
    if (err) {
        let error;
        if (typeof err === 'object')
            error = JSON.stringify(err);
        else error = err;
        let data = {
            'os': remote.process.platform + remote.process.arch,
            'account_addr': ACCOUNT_ADDR,
            'error_str': error
        }
        fetch(B_URL + '/logs/error', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        }).then(function (res) {
            res.json().then(function (resp) {
            })
        })
    }
}

export function setLanguage(lang) {
    return {
        type: types.LANGUAGE,
        payload: lang
    }
}

export function setComponent(component) {
    return {
        type: types.COMPONENT,
        payload: component
    }
}


export const createAccount = (password) => {
    try {
        let request = axios({
            url: URL.CREATE_ACCOUNT,
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            data: {
                password: password
            }
        })

        return {
            type: types.CREATE_ACCOUNT,
            payload: request
        };
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

export function getAccount(cb) {
    try {
        readFile(KEYSTORE_FILE, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                data = JSON.parse(data);
                ACCOUNT_ADDR = '0x' + data.address;
                cb(null, ACCOUNT_ADDR);
            }
        });
    } catch (Err) {
        sendError(Err);
    }
}