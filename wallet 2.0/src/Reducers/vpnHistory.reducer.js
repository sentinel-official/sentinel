import * as types from "../Constants/action.names";
var defaultstate={
    status:false,
    message:''
}
var initialstate2={
        isVPNPayment: false,
        data: null
}
export function getVPNHistory(state = 'Loading', action) {
    switch (action.type) {
        case types.GET_VPN_HISTORY:
            return action.payload
        default:
            return state
    }
}
export function getSnackMessage(state =defaultstate , action) {
    switch (action.type) {
        case types.SNACK_INPUTS:
            return action.payload
        default:
            return state
    }
}
export function getVPNDuePaymentDetails(state =initialstate2 , action) {
    switch (action.type) {
        case types.VPN_DUE_PAYMENT:
            return {...state, ...action.payload}
        default:
            return state

    }
}