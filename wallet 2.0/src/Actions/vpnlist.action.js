import * as types from './../Constants/action.names';
import { B_URL, TMain_URL } from './../Constants/constants';
import axios from 'axios';

export function setListViewType(component) {
    return {
        type: types.LIST_TYPE,
        payload: component
    }
}

export async function getVpnList(vpnType, isTM) {
    let listUrl;
    if (vpnType === 'socks5')
        listUrl = isTM ? TMain_URL + '/nodes?type=Socks5&status=up' : B_URL + '/client/vpn/socks-list'
    else
        listUrl = isTM ? TMain_URL + '/nodes?type=OpenVPN&status=up' : B_URL + '/client/vpn/list'
    let response = await axios.get(listUrl, {
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    });
    if (response.data.success) {
        return {
            type: types.GET_VPN_LIST_SUCCESS,
            payload: isTM ? response.data.nodes : response.data.list
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

export function setVpnStatus(value) {
    return {
        type: types.SET_VPN_STATUS,
        payload: value
    }
}

export function payVPNTM(data) {
    return {
        type: types.TM_PAY_VPN,
        payload: data
    }
}

export function setActiveVpn(data) {
    return {
        type: types.SET_ACTIVE_VPN,
        payload: data
    }
}