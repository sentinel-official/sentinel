
import { B_URL } from './../Constants/constants';
import { readFile } from './../Utils/Keystore';
import { KEYSTORE_FILE } from './../Utils/Keystore';
import { sendError } from './authentication.action';

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


export function getFreeAmount(account_addr, cb) {
    try {
        fetch(B_URL + '/dev/free', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                account_addr: account_addr
            })
        }).then(function (response) {
            response.json().then(function (response) {
                console.log("Free res:", response)
                cb(response.message)
            })
        });
    } catch (Err) {
        sendError(Err);
    }
}