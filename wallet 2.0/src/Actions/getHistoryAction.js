import { SENT_TEST_HISTORY, ETH_TEST_HISTORY } from '../Constants/action.names';
import config from '../Constants/config'
import axios from 'axios';


export async function testSENTTxns(data) {
    let uri = ``;

    if (data.isTest) {
        uri = `${config.test.sentTransUrl1}${data.account_addr}&topic1_2_opr=or&topic2=${data.account_addr}`;
    } else {
        uri = `${config.main.sentTransUrl1}${data.account_addr}&topic1_2_opr=or&topic2=${data.account_addr}`;
    }
    const request = await axios.get(uri);

    return {
        payload: request.data,
        type: SENT_TEST_HISTORY
    }
}

export async function testETHTxns(data) {
    let uri = ``;

    if (data.isTest) {
        uri = `${config.test.ethTransUrl}${data.account_addr}&sort=desc`
    } else {
        uri = `${config.main.ethTransUrl}${data.account_addr}&sort=desc`
    }
    const request = await axios.get(uri);

    return {
        payload: request.data,
        type: ETH_TEST_HISTORY
    }
}