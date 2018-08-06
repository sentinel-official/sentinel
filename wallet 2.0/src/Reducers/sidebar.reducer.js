import * as types from "../Constants/action.names";

export function setCurrentTab(state = 'send', action) {
    switch (action.type) {
        case types.CURRENTTAB:
            return action.payload
        default:
            return state
    }
}