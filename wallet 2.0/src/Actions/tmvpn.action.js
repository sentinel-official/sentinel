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
            error: err.response || 'Something went wrong'
        }
    }
}

export async function getSessionInfo(hash) {
    try {
        let response = await axios.post(TMain_URL + `/sessions`, { txHash: hash }, {
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
            error: err.response || 'Something went wrong'
        }
    }
}

export async function getSignHash(amount, counter, isfinal) {
    // let sessionBuffer = new Buffer(localStorage.getItem('SESSION_NAME'), 'base64');
    // let session_name = sessionBuffer.toString();
    let session_name = localStorage.getItem('SESSION_NAME');
    let data = {
        amount: amount.toString() + 'sut',
        session_id: session_name,
        counter: counter,
        isfinal: isfinal,
        name: localStorage.getItem('SIGNAME'),
        password: localStorage.getItem('SIGPWD')
    }
    try {
        let response = await axios.post(TM_URL + `/send-sign`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
        return {
            type: types.GET_SIGN_HASH,
            payload: response.data,
            error: null
        }
    } catch (err) {
        return {
            type: types.GET_SIGN_HASH,
            payload: null,
            error: err.response || 'Something went wrong'
        }
    }
}

export async function addSignature(data, account_addr) {
    try {
        let url = localStorage.getItem('TM_VPN_URL');
        let sess_id = localStorage.getItem('SESSION_NAME');
        let response = await axios.post(url + `/clients/${account_addr}/sessions/${sess_id}/sign`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
        return {
            type: types.SEND_SIGNATURE,
            payload: response.data,
            error: null
        }
    } catch (err) {
        return {
            type: types.SEND_SIGNATURE,
            payload: null,
            error: err.response || 'Something went wrong'
        }
    }
}

export function deleteTmAccount() {
    let data = {
        password: localStorage.getItem('SIGPWD')
    }

    axios.delete(TM_URL + '/keys/' + localStorage.getItem('SIGNAME'), { data: data }, {
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    })
}

export async function getSessionHistory(account_addr) {
    try {
        let response = await axios({
            url: `${TMain_URL}/accounts/${account_addr}/sessions`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            timeout: 12000
        })
        return {
            type: types.GET_SESSION_HISTORY,
            payload: response.data.sessions
        }
    } catch (err) {
        return {
            type: types.GET_SESSION_HISTORY,
            payload: []
        }
    }
}