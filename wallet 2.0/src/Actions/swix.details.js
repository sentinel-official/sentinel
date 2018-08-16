import { GET_SWIX_RATE_FAILURE, GET_SWIX_RATE_PROGRESS, GET_SWIX_RATE_SUCCESS } from './../Constants/action.names';
import { URL, nodeAddress } from '../Constants/swix.constant';
import axios from 'axios';

export async function swixRate(from, to, value) {

    let response = await axios.get(`${URL.conversionBaseUri}${nodeAddress}&from=${from}&to=${to}&value=${value}`)

    console.log('in swix',response);

    if (response.status === 200) {
        if (response.data.success) {
            return {
                type: GET_SWIX_RATE_SUCCESS,
                payload: response.data.value
            }
        } else {
            return {
                type: GET_SWIX_RATE_FAILURE,
                payload: 'Error in fetching Data'
            }
        }
    } else {
        return {
            type: GET_SWIX_RATE_FAILURE,
            payload: {
                status:response.status,
                statusText:response.statusText
            }
        }
    }

}