import {SOCKS5, SOCKS5_CREDS} from "../Constants/action.names";

export function socksReducer(state = null, action) {
    let response;
    console.log('reducer resp: ', action.payload)
    if (action.payload) {
        response = action.payload
    }
    switch (action.type) {
        // case SOCKS5:

        case SOCKS5:
            if (response && response.success) {
                localStorage.setItem('SESSION_NAME', response['session_name']);
                localStorage.setItem('CONNECTED_VPN', response['vpn_addr']);
                localStorage.setItem('IPGENERATED', response['node']['vpn']['config']['ip']);
                localStorage.setItem('LOCATION', response['node']['location']['city']);
                localStorage.setItem('SPEED',  Number(response['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + ' mbps');
                return response['node']['vpn']['config']
                // cb(null, response['node']['vpn']['config']);
            }
            else {
                return { message: response.message || 'Error occurred while getting OVPN file, may be empty VPN resources.' };
            }
        default:
            return state
    }
}