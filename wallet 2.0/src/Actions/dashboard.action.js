import * as types from './../Constants/action.names';
import { KEYSTORE_FILE } from './../Utils/Keystore';
let fs = window.require('fs');

export function getAccount() {
    try {
        let data = fs.readFileSync(KEYSTORE_FILE);
        data = JSON.parse(data);
        let ACCOUNT_ADDR = '0x' + data.address;
        return {
            type: types.GETACCOUNT,
            payload: ACCOUNT_ADDR
        }
    } catch (err) {
        return {
            type: types.GETACCOUNT,
            payload: null
        }
    }
}