import { setTimeout } from "core-js/library/web/timers";

export default class ActivityIndicator {
    static load(cb) {
        setTimeout(cb, 5000);
    }
}