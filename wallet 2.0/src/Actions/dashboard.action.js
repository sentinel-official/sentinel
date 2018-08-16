import * as types from './../Constants/action.names';
import { KEYSTORE_FILE } from './../Utils/Keystore';
let fs = window.require('fs');

export function getAccount() {
    try {
        let data = fs.readFileSync(KEYSTORE_FILE);
        data = JSON.parse(data);
        let ACCOUNT_ADDR = '0x' + data.address;
        return {
            type: types.GET_ACCOUNT_SUCCESS,
            payload: ACCOUNT_ADDR
        }
    } catch (error) {
        return {
            type: types.GET_ACCOUNT_ERROR,
            error
        }
    }
}