import * as types from './../Constants/action.names';

export function getFreeAmount(state = {}, action) {
    switch (action.type) {
        case types.GET_FREE_AMOUNT:
            return action.payload && action.payload.data ?
                action.payload.data : { success: 'false', message: 'Error while getting tokens' }
        default:
            return state
    }
}
