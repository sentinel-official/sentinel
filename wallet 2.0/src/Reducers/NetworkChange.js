import { NETWORK_TYPE } from "../Constants/action.names";

export function networkChange(state = 'public', action) {
    switch (action.type) {
        case NETWORK_TYPE:
            return action.payload;
        default:
            return state
    }
}