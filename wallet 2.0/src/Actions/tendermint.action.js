import * as types from './../Constants/action.names';
import { TM_URL, TM_FREE_TOKEN_URL } from '../Constants/constants';
import { getTMConfig } from './../Utils/UserConfig';
import axios from 'axios';

// Fetch TxHash from MN API
// Iterate For loop to get info of TxHash Locally [1317/txs/:hash]

var txs = [
    { from: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', to: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', hash: '0FD368A16E6E8DE0CC44E7E85B1785119284E4EE' },
    { from: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', to: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', hash: '0FD368A16E6E8DE0CC44E7E85B1785119284E4EE' },
    { from: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', to: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', hash: '0FD368A16E6E8DE0CC44E7E85B1785119284E4EE' },
    { from: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', to: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', hash: '0FD368A16E6E8DE0CC44E7E85B1785119284E4EE' },
    { from: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', to: 'cosmosaccaddr13395u2hjqa29pxp6qew6dt3vd48ht6zchjupg3', hash: '0FD368A16E6E8DE0CC44E7E85B1785119284E4EE' }
]
var responses = []

export async function getTxInfo() {
    for (let i = 0; i < txs.length; i++) {
        let response = await axios.get(TM_URL + '/txs/' + txs[i].hash, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
        responses.push({
            hash: response.data.hash,
            amount : response.data.tx.value.msg[0].value.Coins[0].amount,
            from : response.data.tx.value.msg[0].value.From,
            to: response.data.tx.value.msg[0].value.To,
            gas: response.data.result.gas_used
        })
        
    }
    console.log("Data from redux: ", responses)
    return {
        type: types.GET_TX_DATA,
        payload: responses
    }
}


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
            error: err.response || 'Something went wrong'
        }
    }
}

export function getTendermintAccount(cb) {
    getTMConfig((err, data) => {
        let configData = JSON.parse(data);
        if (configData && 'tmUserName' in configData)
            cb(configData.tmUserName)
        else
            cb(null)
    })
}

export function setTMAccount(data) {
    return {
        type: types.SET_TM_ACCOUNT,
        payload: data
    }
}

export async function getFreeTokens(account_addr) {
    try {
        let response = await axios({
            url: `${TM_FREE_TOKEN_URL}/get-tokens`,
            method: 'POST',
            data: {
                address: account_addr
            },
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            timeout: 12000
        })
        return {
            type: types.GET_TOKENS,
            payload: response.data,
            error: null
        }
    } catch (err) {
        return {
            type: types.GET_TOKENS,
            payload: null,
            error: err.response || 'Something went wrong while getting tokens'
        }
    }
}