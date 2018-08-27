import * as types from "../Constants/action.names";

export function createTMAccount(state = null, action) {
    switch (action.type) {
        case types.CREATE_TMACCOUNT:
            return action.payload;
        default:
            return state
    }
}