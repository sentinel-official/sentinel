import * as types from "../Constants/action.names";
import { createFile } from './../Utils/Keystore';
const electron = window.require('electron');
const remote = electron.remote;
const SENT_DIR = getSentDir();
const KEYSTORE_FILE = getKeystoreFile();

function getUserHome() {
    return remote.process.env[(remote.process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getSentDir() {
    if (remote.process.platform === 'win32') {
        return `${getUserHome()}\\.sentinel`
    } else {
        return `${getUserHome()}/.sentinel`
    }
}

function getKeystoreFile() {
    if (remote.process.platform === 'win32') {
        return `${SENT_DIR}\\keystore`
    } else {
        return `${SENT_DIR}/keystore`
    }
}

export function setLanguage(state = 'zh', action) {
    switch (action.type) {
        case types.LANGUAGE:
            return action.payload
        default:
            return state
    }
}

export function setComponent(state = null, action) {
    switch (action.type) {
        case types.COMPONENT:
            return action.payload
        default:
            return state
    }
}

export function createAccount(state = null, action) {
    switch (action.type) {
        case types.CREATE_ACCOUNT:
            {
                var response = action.payload;
                if (response.data && response.data.success === true) {
                    response = response.data;
                    var account_addr = response.account_addr;
                    var keystore = response.keystore;
                    var private_key = response.private_key;

                    createFile(KEYSTORE_FILE, keystore)

                    return {
                        account_addr: account_addr,
                        private_key: private_key,
                        keystore_addr: KEYSTORE_FILE
                    }
                }
                else return state

            }
        default:
            return state
    }
}