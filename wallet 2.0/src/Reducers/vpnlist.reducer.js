import * as types from "../Constants/action.names";

export function setListViewType(state = 'map', action) {
    switch (action.type) {
        case types.LIST_TYPE:
            return action.payload
        default:
            return state
    }
}

export function setVpnType(state = 'openvpn', action) {
    switch (action.type) {
        case types.SET_VPN_TYPE:
            return action.payload
        default:
            return state
    }
}

export function getVpnList(state = [], action) {
    switch (action.type) {
        case types.GET_VPN_LIST_SUCCESS:
            return action.payload
        case types.GET_VPN_LIST_PROGRESS:
            return action.payload
        default:
            return state
    }
}