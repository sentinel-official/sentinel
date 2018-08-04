import * as types from "../Constants/action.names";

export function getAccount(state = null, action) {
    switch (action.type) {
        case types.GETACCOUNT:
            return action.payload
        default:
            return state
    }
}