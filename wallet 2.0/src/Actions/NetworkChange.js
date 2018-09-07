import { NETWORK_TYPE } from "../Constants/action.names";

export function networkChange(networkType) {
    localStorage.setItem('networkType', networkType);
    return {
        type: NETWORK_TYPE,
        payload: networkType
    }
}