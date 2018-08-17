import { VPN_USAGE } from './../Constants/action.names';

export function VPNUsage(state = null, action) {
    switch (action.type) {
        case VPN_USAGE:
            if(action.payload.data.success) {
                return action.payload.data['usage']
            } else {
                return { message: action.payload.data.message || 'no data' };
            }
        default:
            return state
    }
}
