import * as types from "../Constants/action.names";

export function getTxInfo(state = [], action) {
    switch (action.type) {
        case types.GET_TX_DATA:
            return action.payload;
        default:
            return state
    }
}

export function getKeys(state = [], action) {
    switch (action.type) {
        case types.GET_KEYS:
            return action.payload;
        default:
            return state
    }
}

export function setTMComponent(state = 'home', action) {
    switch (action.type) {
        case types.SET_TM_COMPONENT:
            return action.payload;
        default:
            return state
    }
}

export function tmBalance(state = null, action) {
    switch (action.type) {
        case types.GET_TMBALANCE:
            return action.payload;
        default:
            return state
    }
}

export function setTMAccount(state = null, action) {
    switch (action.type) {
        case types.SET_TM_ACCOUNT:
            return action.payload;
        default:
            return state
    }
}