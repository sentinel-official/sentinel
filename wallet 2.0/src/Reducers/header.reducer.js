import * as types from "../Constants/action.names";

export function setTestNet(state = false, action) {
    switch (action.type) {
        case types.TESTNET:
            return action.payload;
        default:
            return state
    }
}

export function getWalletType(state = 'TM', action) {
    switch (action.type) {
        case types.WALLET_VALUE:
            return action.payload;
        default:
            return state
    }
}


export function getETHBalance(state = 'Loading', action) {
    switch (action.type) {
        case types.GET_ETH_BAL_SUCCESS:
            return action.payload
        case types.GET_ETH_BAL_PROGRESS:
            return action.payload
        default:
            return state
    }
}

export function getSentBalance(state = 'Loading', action) {
    switch (action.type) {
        case types.GET_SENT_BAL_SUCCESS:
            return action.payload
        case types.GET_VPN_LIST_PROGRESS:
            return action.payload
        default:
            return state
    }
}

export function setTendermint(state = false, action) {
    switch (action.type) {
        case types.TENDERMINT:
            return action.payload;
        default:
            return state
    }
}