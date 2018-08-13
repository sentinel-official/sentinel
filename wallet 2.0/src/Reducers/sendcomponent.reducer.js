import * as types from '../Constants/sendcomponent.types';

const initialState = {
    data: null,
    loading: true,
    error: null
}

export function sendComponentReducer(state = initialState, action) {
    switch (action.type) {
        case types.TX_SUCCESS:
            return { ...state, data: action.payload, loading: false }
        case types.TX_FAILURE:
            return { ...state, error: action.payload, loading: false }
        case types.TX_ERROR:
            return { ...state, error: action.payload, loading: false }
        default:
            return state
    }
}