import { sendError } from './../Actions/authentication.action';

export const isOnline = function () {
    try {
        if (window.navigator.onLine) {
            return true
        }
        else {
            return false
        }
    } catch (Err) {
        sendError(Err);
    }
}