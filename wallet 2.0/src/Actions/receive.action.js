
import { readFile } from './../Utils/Keystore';
import { KEYSTORE_FILE } from './../Utils/Keystore';
import { sendError } from './authentication.action';
import { FREE_AMOUNT_API } from '../Constants/api.routes';
import { GET_FREE_AMOUNT } from './../Constants/action.names';
import axios from 'axios';

var ACCOUNT_ADDR = '';
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


export function getFreeAmount(account_addr) {
    try {
        let request = axios({
            url: FREE_AMOUNT_API,
            method: 'POST',
            data: {
                account_addr: account_addr
            }
        })
        
        return {
            type: GET_FREE_AMOUNT,
            payload:  request
        }
    } catch (Err) {
        sendError(Err);
    }
}