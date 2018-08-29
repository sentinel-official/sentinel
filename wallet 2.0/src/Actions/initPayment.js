import { INIT_PAYMENT } from "../Constants/action.names";

export const initPaymentAction = (data) => {

    return {
        payload: data,
        type: INIT_PAYMENT
    }
};