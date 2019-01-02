import * as types from './../Constants/action.names';
import { TM_URL } from '../Constants/constants';
import axios from 'axios';

export async function createTMAccount(name, password) {
    let data = {
        name: name,
        password: password
    }
    try {
        let response = await axios.post(TM_URL + '/keys', data, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
        return {
            type: types.CREATE_TMACCOUNT,
            payload: response.data,
            error: null
        }
    } catch (err) {
        return {
            type: types.CREATE_TMACCOUNT,
            payload: null,
            error: err.response || 'Something went wrong'
        }
    }
}