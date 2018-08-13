import * as types from "../Constants/action.names";
export function getVPNHistory(state = 'Loading', action) {
    switch (action.type) {
        case types.GET_VPN_HISTORY:
            return action.payload
        default:
            return state
    }
}
export function getSnackMessage(state = null, action) {
    switch (action.type) {
        case types.SNACK_INPUTS:
            return action.payload
        default:
            return { status: false, measage: '' }
    }
}
export function getVPNDuePaymetnDetails(state = null, action) {
    switch (action.type) {
        case types.VPN_DUE_PAYMENT:
            return action.payload
        default:
            return {
                isVPNPayment: false,
                data: null
            }

    }
}