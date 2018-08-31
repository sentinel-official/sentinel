import { NETWORK_TYPE } from "../Constants/action.names";

export function networkChange(networkType) {
    return {
        type: NETWORK_TYPE,
        payload: networkType
    }
}