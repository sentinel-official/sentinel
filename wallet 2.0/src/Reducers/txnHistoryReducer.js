import { SENT_TEST_HISTORY, ETH_TEST_HISTORY } from '../Constants/action.names'

export function testSENTHistory(state = null, action) {

    switch (action.type) {

        case SENT_TEST_HISTORY:
            return action.payload;

        default:
            return state
    }

}

export function testETHHistory(state = null, action) {

    switch (action.type) {

        case ETH_TEST_HISTORY:
            return action.payload;

        default:
            return state
    }

}