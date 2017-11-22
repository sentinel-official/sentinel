import { FETCH_TX, FETCH_TX_SUCCESS, FETCH_TX_FAILURE } from '../constants'

const initialState = {
	txs: [],
	isFetching: false,
	error: false
}

export default function TxReducer(state = initialState, action) {
	switch(action.type) {
		case FETCH_TX:
			return {
				...state,
				isFetching: true,
				people: []
			}
		case FETCH_TX_SUCCESS:
			return {
				...state,
				isFetching: false,
				people: action.data
			}
		case FETCH_TX_FAILURE:
			return {
				...state,
				isFetching: false,
				error: true
			}
		default:
			return state
		}
	}
}