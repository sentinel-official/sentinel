import * as types from "../Constants/action.names";

export function getAccount(state = null, action) {
    switch (action.type) {
        case types.GET_ACCOUNT_SUCCESS:
            return action.payload
        case types.GET_ACCOUNT_ERROR:
            return action.error
        default:
            return state
    }
}