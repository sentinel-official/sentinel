import { INIT_PAYMENT } from "../Constants/action.names";

export function getInitPaymentDetails(state = null, action) {
    switch (action.type) {
        case INIT_PAYMENT:
            return action.payload;
        default:
            return state
    }
}