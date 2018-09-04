import * as types from "../Constants/action.names";

export function getSessionInfo(state = null, action) {
    switch (action.type) {
        case types.GET_SESSION_INFO:
            return action.payload;
        default:
            return state
    }
}