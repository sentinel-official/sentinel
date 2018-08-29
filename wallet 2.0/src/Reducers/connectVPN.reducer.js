import { CONNECT_VPN } from "../Constants/action.names";

export function connectVPNReducer(state = null, action) {
    switch (action.type) {
    case CONNECT_VPN:
            return action.payload;

            default:
            return state
    }
}