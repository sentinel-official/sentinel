import * as types from './../Constants/action.names';
import { B_URL } from './../Constants/constants';
import axios from 'axios';

export function setListViewType(component) {
    return {
        type: types.LIST_TYPE,
        payload: component
    }
}

export async function getVpnList(vpnType) {
    let listUrl;
    if (vpnType === 'socks5')
        listUrl = B_URL + '/client/vpn/socks-list'
    else
        listUrl = B_URL + '/client/vpn/list'
    let response = await axios.get(listUrl, {
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    })
    if (response.data.success) {
        return {
            type: types.GET_VPN_LIST_SUCCESS,
            payload: response.data.list
        }
    } else {
        return {
            type: types.GET_VPN_LIST_PROGRESS,
            payload: []
        }
    }
}

export function setVpnType(vpnType) {
    return {
        type: types.SET_VPN_TYPE,
        payload: vpnType
    }
}