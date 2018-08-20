import axios from 'axios';
import { SOCKS5, SOCKS5_CREDS } from '../Constants/action.names'
import { B_URL } from '../Constants/constants'

const electron = window.require('electron');
const remote = electron.remote;
const { exec,  } = window.require('child_process');

// export function connectSocks(account_addr, vpn_addr, cb) {
//
//     // localStorage.setItem('CONNECTED', false);
//
// }

export async function connectSocks(account_addr, vpn_addr) {

    let data = {
        'account_addr': account_addr,
        'vpn_addr': vpn_addr
    };
    const uri = `${B_URL}/client/vpn`;
    return await axios.post(uri, data)
        .then(res => {
            if (res.data.success) {
                getSocksCreds(account_addr, res.data['ip'], res.data['port'], res.data['vpn_addr'], res.data['token'], function (err, data) {
                    if (err) {
                        return {payload: err, type: SOCKS5}
                    }
                    else {
                        console.log('trying to execute cmd');
                        exec('ss-local -s ' + data['ip'] + ' -m ' + data['method'] + ' -k ' + data['password'] + ' -p ' + data['port'] + ' -l 1080', function (err, stdout, stderr) {
                            if (stdout) {
                                console.log('connecting');
                                return { payload: { message: 'connected to socks5' }, type: SOCKS5  }
                            } else {
                                console.log('error in connecting SOCKS5');
                                return { payload: { message: 'error in connecting to socks5' }, type: SOCKS5  };
                            }
                        });
                        if (remote.process.platform === 'darwin') {
                            let netcmd = `services=$(networksetup -listnetworkserviceorder | grep 'Hardware Port'); while read line; do sname=$(echo $line | awk -F  "(, )|(: )|[)]" '{print $2}'); sdev=$(echo $line | awk -F  "(, )|(: )|[)]" '{print $4}'); if [ -n "$sdev" ]; then ifout="$(ifconfig $sdev 2>/dev/null)"; echo "$ifout" | grep 'status: active' > /dev/null 2>&1; rc="$?"; if [ "$rc" -eq 0 ]; then currentservice="$sname"; currentdevice="$sdev"; currentmac=$(echo "$ifout" | awk '/ether/{print $2}'); fi; fi; done <<< "$(echo "$services")"; if [ -n "$currentservice" ]; then echo $currentservice; else >&2 echo "Could not find current service"; exit 1; fi`;
                            exec(netcmd, function (err, stdout, stderr) {
                                if (stdout) {
                                    console.log("NEt Out...", stdout.toString());
                                    let currentService = stdout.trim();
                                    exec(`networksetup -setsocksfirewallproxy '${currentService}' localhost 1080 && networksetup -setsocksfirewallproxystate '${currentService}' on`, function (error, Stdout, Stderr) {
                                    })
                                }
                                if (err) {
                                    console.log("Error..", err);
                                }
                            })
                        }
                    }
                })

            } else {
                if (res.data.account_addr)
                    return { payload: { message: res.data.message || 'Initial Payment is not done', account_addr: res.data.account_addr}, type: SOCKS5};
                else
                    return{  payload: { message: res.data.message || 'Error occurred while connecting to SOCKS5 node. Please Try Again' }, type: SOCKS5};
            }
        })
}

export function getSocksCreds(account_addr, vpn_ip, vpn_port, vpn_addr, nonce, cb) {
    // fetch('http:' + vpn_ip + ':' + vpn_port + '/creds', {


        let uri = `http://${vpn_ip}:${vpn_port}/creds`;
        let data = {
            'account_addr': account_addr,
            'vpn_addr': vpn_addr,
            'token': nonce
        };

        axios.post(uri, data)
            .then(response =>  {
                console.log('1', response.data.node.vpn.config);

                if (response.data.success) {
                    console.log('2', response.data.node.vpn.config);
                    localStorage.setItem('SESSION_NAME', response.data['session_name']);
                    localStorage.setItem('CONNECTED_VPN', vpn_addr);
                    localStorage.setItem('IPGENERATED', response.data['node']['vpn']['config']['ip']);
                    localStorage.setItem('LOCATION', response.data['node']['location']['city']);
                    localStorage.setItem('SPEED',  Number(response.data['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + ' mbps');
                    cb(null, response.data['node']['vpn']['config']);
                }
                else {
                    cb({ message: response.data.message || 'Error occurred while getting SOCKS5 credentials, may be empty VPN resources.' }, null);
                }
            })
}