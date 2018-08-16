import * as types from './../Constants/action.names';
import config from '../Constants/config';
import axios from 'axios';

export function setTestNet(value) {
    return {
        type: types.TESTNET,
        payload: value
    }
}

export async function getETHBalance(address, isTest) {
    let ETH_BALANCE_URL = isTest ? config.test.ethBalanceUrl : config.main.ethBalanceUrl;
    let response = await axios.get(ETH_BALANCE_URL + address, {
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    })
    if (response.data.status === '1') {
        var balance = response.data.result / (10 ** 18);
        return {
            type: types.GET_ETH_BAL_SUCCESS,
            payload: balance
        }
    } else {
        return {
            type: types.GET_ETH_BAL_PROGRESS,
            payload: 'Loading'
        }
    }
}

export async function getSentBalance(address, isTest) {
    let SENT_BALANCE_URL = isTest ? config.test.sentBalanceUrl : config.main.sentBalanceUrl;
    let response = await axios.get(SENT_BALANCE_URL + address, {
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    })
    if (response.data.status === '1') {
        var balance = response.data.result / (10 ** 8);
        return {
            type: types.GET_SENT_BAL_SUCCESS,
            payload: balance
        }
    } else {
        return {
            type: types.GET_SENT_BAL_PROGRESS,
            payload: 'Loading'
        }
    }
}