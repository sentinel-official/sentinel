import * as types from "../Constants/action.names";

export function setTestNet(state = false, action) {
    switch (action.type) {
        case types.TESTNET:
            return action.payload
        default:
            return state
    }
}

export function getETHBalance(state = 'Loading', action) {
    switch (action.type) {
        case types.GETETHBAL:
            return action.payload
        default:
            return state
    }
}

export function getSentBalance(state = 'Loading', action) {
    switch (action.type) {
        case types.GETSENTBAL:
            return action.payload
        default:
            return state
    }
}