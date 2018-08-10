import * as types from "../Constants/action.names";

export function setListViewType(state = 'map', action) {
    switch (action.type) {
        case types.LISTTYPE:
            return action.payload
        default:
            return state
    }
}

export function setVpnType(state = 'openvpn', action) {
    switch (action.type) {
        case types.SETVPNTYPE:
            return action.payload
        default:
            return state
    }
}

export function getVpnList(state = [], action) {
    switch (action.type) {
        case types.GETVPNLIST:
            return action.payload
        default:
            return state
    }
}