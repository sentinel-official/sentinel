import * as types from "../Constants/action.names";

export function setListViewType(state = 'list', action) {
    switch (action.type) {
        case types.LIST_TYPE:
            return action.payload;
        default:
            return state
    }
}

export function setVpnType(state = 'openvpn', action) {
    switch (action.type) {
        case types.SET_VPN_TYPE:
            return action.payload;
        default:
            return state
    }
}

export function setVpnStatus(state = false, action) {
    switch (action.type) {
        case types.SET_VPN_STATUS:
            return action.payload;
        default:
            return state
    }
}

export function getVpnList(state = [], action) {
    switch (action.type) {
        case types.GET_VPN_LIST_SUCCESS:
            return action.payload;
        case types.GET_VPN_LIST_PROGRESS:
            return action.payload;
        default:
            return state
    }
}

export function payVPNTM(state = { 'isPayment': false }, action) {
    switch (action.type) {
        case types.TM_PAY_VPN:
            return action.payload;
        default:
            return state
    }
}

export function getActiveVpn(state = {}, action) {
    switch (action.type) {
        case types.SET_ACTIVE_VPN:
            return action.payload;
        default:
            return state
    }
}

export function getCurrentVpn(state = {}, action) {
    switch (action.type) {
        case types.SET_CURRENT_VPN:
            return action.payload;
        default:
            return state
    }
}