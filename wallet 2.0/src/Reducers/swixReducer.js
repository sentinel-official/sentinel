import { GET_SWIX_RATE_FAILURE, GET_SWIX_RATE_PROGRESS, GET_SWIX_RATE_SUCCESS } from './../Constants/action.names';


export function swixRateInState(state = { value: 0 }, action) {

    switch (action.type) {

        case GET_SWIX_RATE_FAILURE:
            return { ...state, value: action.payload };
        case GET_SWIX_RATE_SUCCESS:
            return { ...state, value: action.payload };
        default:
            return state
    }

}