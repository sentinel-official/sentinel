import { FETCH_TX, FETCH_TX_SUCCESS, FETCH_TX_FAILURE } from './constants'

export function fetchTxFromAPI() {
	return (dispatch) {
		dispatch(getTx())
		fetch('https://swapi.co/api/people/')
		.then(res => res.json())
		.then(json => dispatch(getTxSuccess(json.results)))
		.catch(err => dispatch(getTxFailure(err)))
	}
}

function getTx(){
	return {
		type: FETCH_TX
	}
}

function getTxSuccess() {
	return {
		type: FETCH_TX_SUCCESS,
		data
	}
}

function getTxFailure() {
	return {
		type: FETCH_TX_FAILURE
	}
}