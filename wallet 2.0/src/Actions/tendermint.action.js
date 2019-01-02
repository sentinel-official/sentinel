import * as types from './../Constants/action.names';
import { TM_URL } from '../Constants/constants';
import { getConfig } from './../Utils/UserConfig';
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
        let response = await axios.post(TM_URL + `/send`, data, {
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

export function getTendermintAccount(cb) {
    getConfig((err, data) => {
        let configData = JSON.parse(data);
        if ('tmUserName' in configData)
            cb(configData.tmUserName)
        else
            cb(null)
    })
}

export function setTMAccount(data){
    return {
        type: types.SET_TM_ACCOUNT,
        payload: data
    }
}