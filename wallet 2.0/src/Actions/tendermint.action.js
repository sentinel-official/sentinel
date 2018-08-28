import * as types from './../Constants/action.names';
import { TM_URL } from '../Constants/constants';
import axios from 'axios';

export async function getKeys() {
    let response = await axios.get(TM_URL + '/keys', {
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    })
    return {
        type: types.GET_KEYS,
        payload: response.data
    }
}

export function setTMComponent(component) {
    return {
        type: types.SET_TM_COMPONENT,
        payload: component
    }
}

export async function getTMBalance(address) {
    try {
        let response = await axios.get(TM_URL + '/accounts/' + address, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
        return {
            type: types.GET_TMBALANCE,
            payload: response.data
        }
    } catch (err) {
        return {
            type: types.GET_TMBALANCE,
            payload: null
        }
    }
}

export async function sendAmount(data, toAddr) {
    try {
        let response = await axios.post(TM_URL + `/accounts/${toAddr}/send`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
        return {
            type: types.SEND_TMAMOUNT,
            payload: response.data,
            error: null
        }
    } catch (err) {
        return {
            type: types.SEND_TMAMOUNT,
            payload: null,
            error: err.response
        }
    }
}

export async function payVPNSession(data, toAddr) {
    try {
        let response = await axios.post(TM_URL + `/vpn/pay`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
        return {
            type: types.PAY_VPN,
            payload: response.data,
            error: null
        }
    } catch (err) {
        return {
            type: types.PAY_VPN,
            payload: null,
            error: err.response
        }
    }
}