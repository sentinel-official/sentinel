import * as types from "../Constants/action.names";

export function getEthBalance(state = null, action) {
    switch (action.type) {
        case types.GET_ETH_BALANCE:
            if (action.payload.data && action.payload.data.balance && action.payload.data.status === 1) {
                var balance = action.payload.data.balance / (10 ** 18);
                return balance
            } else return state
        default:
            return state
    }
}

export function getSentBalance(state = null, action) {
    console.log(action.payload)
    switch (action.type) {
        case types.GET_SENT_BALANCE:
            if (action.payload) {
                var balance = action.payload / (10 ** 18);
                return balance
            } else return state
        default:
            return state
    }
}

export function getAvailableTokens(state = null, action) {
    switch (action.type) {
        case types.GET_AVAIL_BALANCE:
            if (action.payload.data && action.payload.data.success && action.payload.data.tokens) {
                return action.payload.data.tokens
            } else return state
        default:
            return state
    }
}
