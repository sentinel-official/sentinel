import * as types from './../Constants/action.names';
import { TM_URL, TMain_URL } from '../Constants/constants';
import axios from 'axios';

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

export async function getSessionInfo(hash) {
    try {
        let response = await axios.get(TMain_URL + `/session?hash=` + hash, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
        return {
            type: types.GET_SESSION_INFO,
            payload: response.data,
            error: null
        }
    } catch (err) {
        return {
            type: types.GET_SESSION_INFO,
            payload: null,
            error: err.response
        }
    }
}