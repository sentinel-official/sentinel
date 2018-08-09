import * as types from "../Constants/action.names";

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
export function getSentValue(state = null, action) {
    switch (action.type) {
        case types.GET_SENT_VALUE:
            if (action.payload && action.payload.data && action.payload.data.value && action.payload.data.success === true) {
                var tokens = action.payload.data.value / (10 ** 8);
                return tokens
            } else {
                return state
            }
        default:
            return state
    }
}

