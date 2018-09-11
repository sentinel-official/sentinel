import axios from 'axios';
import { axiosInstance } from '../Actions/AxiosGlobalConfig';
import { VPN_USAGE } from '../Constants/action.names'
import { B_URL, BOOT_URL } from '../Constants/constants'
const fs = window.require('fs');
const electron = window.require('electron');
const { exec, execSync } = window.require('child_process');
const remote = electron.remote;
const SENT_DIR = getUserHome() + '/.sentinel';
const TM_DIR = getUserHome() + '/.sentinel/.tendermint';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
export const CONFIG_FILE = `${SENT_DIR}/config`;

if (!fs.existsSync(SENT_DIR)) fs.mkdirSync(SENT_DIR);
if (!fs.existsSync(TM_DIR)) {
    fs.mkdirSync(TM_DIR);
    execSync('chmod 777 ' + TM_DIR);
}
if (fs.existsSync(OVPN_FILE)) fs.unlinkSync(OVPN_FILE);

export function getUserHome() {
    return remote.process.env[(remote.process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

export function checkDependencies(packageNames, cb) {

    // execSync("export PATH=$PATH:/usr/local/opt/openvpn/sbin");
    packageNames.map((packageName) => {
        exec("dpkg-query -W -f='${Status}' " + packageName,
            function (err, stdout, stderr) {
                if (err || stderr) {
                    cb(null, packageName);
                    execSync('sudo apt-get install ' + packageName + ' -yy');
                    throw err || stderr;
                    // sendError(err || stderr);
                }
                else {
                    let brewPath = stdout.trim();
                    if (brewPath.length > 0) cb(null, true);
                    else cb(null, false);
                }
            })
    });
}

export function setMaster(cb) {
    getConfig((err, data) => {
        if (err) {
            cb(true);
        }
        else {
            let configData = JSON.parse(data);
            configData.isPrivate = false;
            fs.writeFile(CONFIG_FILE, JSON.stringify(configData), (err) => {
                getMasterUrl()
                cb(true)
            })
        }
    });
}

export function getMasterUrl() {
    axios.post(`${BOOT_URL}/master`, { 'authCode': null }).then(function (res) {
        // let B_URL;
        if (res.data.success) {
            localStorage.setItem('networkType', 'public');
            localStorage.setItem('authcode', null);
            // localStorage.setItem('access_token', null);
            localStorage.setItem('B_URL', res.data.url)
        }
    })
}

//getOVPNAndSave needs following args => AccountAddr, VPN_IP, VPN_PORT, VPN_ADDR, NONCE, CB

export function getOVPNAndSave(account_addr, vpn_ip, vpn_port, vpn_addr, nonce, cb) {

    let uri = `http://${vpn_ip}:${vpn_port}/ovpn`;

    let data = {
        account_addr: account_addr,
        vpn_addr: vpn_addr,
        token: nonce
    };

    if (fs.existsSync(OVPN_FILE)) {
        cb(null);
    } else {
        axiosInstance.post(uri, data).then(response => {
            console.log('calling the axios global instance')
            if (response.data.success) {
                if (response.data['node'] === null) {
                    cb({ message: 'Something wrong. Please Try Later' })
                }
                else {
                    let vpn_data = {
                        city: response.data['node']['location']['city'],
                        speed: response.data['node']['net_speed']['download'],
                        vpn_addr: vpn_addr
                    }
                    ovpnSave(vpn_data, response.data['session_name'], response.data['node']['vpn']['ovpn'], (res) => {
                        cb(res);
                    })
                }
            } else {
                cb({ message: response.data.message || 'Error occurred while getting OVPN file, may be empty VPN resources.' })
            }
        })
    }
}

export function ovpnSave(vpn_data, session_id, ovpn, cb) {
    if (remote.process.platform === 'win32' || remote.process.platform === 'darwin') {
        for (var i = 15; i <= 20; i++) {
            if (ovpn[i].split(' ')[0] === 'up' || ovpn[i].split(' ')[0] === 'down') {
                delete (ovpn[i]);
            }
        }
    }
    let joinedOvpn = ovpn.join('');
    localStorage.setItem('SESSION_NAME', session_id);
    localStorage.setItem('CONNECTED_VPN', vpn_data.vpn_addr);
    localStorage.setItem('IPGENERATED', ovpn[3].split(' ')[1]);
    localStorage.setItem('LOCATION', vpn_data.city);
    localStorage.setItem('SPEED', Number(vpn_data.speed / (1024 * 1024)).toFixed(2) + ' Mbps');
    fs.writeFile(OVPN_FILE, joinedOvpn, function (err) {
        if (err) cb({ message: 'Error in fetching ovpn file' });
        else cb(null);
    });
}


export function getOVPNTM(account_addr, vpn_data, session_data, cb) {
    let data = {
        account_addr: account_addr,
        session_id: session_data.sessionId,
        token: session_data.token
    }
    if (fs.existsSync(OVPN_FILE)) {
        cb(null);
    } else {
        axios.post(session_data.url + '/session/credentials', data)
            .then(response => {
                if (response.data.success) {
                    localStorage.setItem('TOKEN', session_data.token);
                    localStorage.setItem('TM_VPN_URL', session_data.url);
                    ovpnSave(vpn_data, session_data.sessionId, response.data.ovpn, cb);
                }
                else {
                    cb({ message: 'Error occured while getting ovpn' })
                }
            })
            .catch(err => {
                cb({ message: 'Error occured while getting ovpn' })
            })
    }
}

export async function getVPNUsageData(account_addr) {
    let uri, data;
    if (localStorage.getItem('isTM') === 'true') {
        let url = localStorage.getItem('TM_VPN_URL');
        uri = url + '/client/usage';
        data = {
            account_addr: account_addr,
            session_id: localStorage.getItem('SESSION_NAME'),
            token: localStorage.getItem('TOKEN')
        }
    }
    else {
        let baseUrl = localStorage.getItem('B_URL');
        uri = `${baseUrl}/client/vpn/current`;
        data = {
            account_addr: account_addr,
            session_name: localStorage.getItem('SESSION_NAME')
        };
    }

    let request = await axios.post(uri, data);

    return {
        payload: request,
        type: VPN_USAGE
    };
}


export const isOnline = function () {
    try {
        return window.navigator.onLine;
    } catch (Err) {
        return Err;
    }
};

export function checkGateway(cb) {
    getConfig((err, data) => {
        if (err) {
            cb(true, null, null);
        }
        else {
            let configData = JSON.parse(data);
            if (configData.hasOwnProperty('gatewayUrl')) {
                if (configData.gatewayUrl) {
                    console.log("Confi..", configData.gatewayUrl)
                    localStorage.setItem('B_URL', configData.gatewayUrl);
                    configData.isPrivate = true;
                    localStorage.setItem('networkType', 'private');
                    localStorage.setItem('authcode', configData.authcode);
                    fs.writeFile(CONFIG_FILE, JSON.stringify(configData), (errR) => {
                        getClientToken(configData.authcode, configData.gatewayUrl, (error, data) => {
                            console.log("True...")
                            cb(null, configData.authcode, configData.gatewayUrl)
                        })
                    })
                }
                else {
                    cb(true, null, null)
                }
            }
            else {
                // console.log('d')
                cb(true, null, null);
            }
        }
    });
}

export function isPrivate(cb) {
    getConfig(function (err, data) {
        if (err) { cb(false) }
        else {
            let configData = JSON.parse(data);
            if (configData.hasOwnProperty('isPrivate')) {
                if (configData.isPrivate) {
                    localStorage.setItem('B_URL', configData.gatewayUrl);
                    localStorage.setItem('networkType', 'private');
                    localStorage.setItem('authcode', configData.authcode);
                    getClientToken(configData.authcode, configData.gatewayUrl, (error, data) => {
                        cb(true, configData.authcode)
                    })
                }
                else {
                    getMasterUrl();
                    cb(false, '')
                }
            }
            else {
                getMasterUrl();
                cb(false, '')
            }
        }
    })
}

export async function getGatewayUrl(authCode, cb) {
    axios.post(BOOT_URL + '/master', { 'authCode': authCode }).then(function (response) {
        if (response.data.success) {
            getConfig((err, data) => {
                if (err) { }
                else {
                    let configData = JSON.parse(data);
                    configData.gatewayUrl = response.data.url;
                    configData.isPrivate = true;
                    configData.authcode = authCode;
                    fs.writeFile(CONFIG_FILE, JSON.stringify(configData), function (err) {
                        localStorage.setItem('networkType', 'private');
                        localStorage.setItem('authcode', authCode);
                        localStorage.setItem('B_URL', response.data.url);
                        getClientToken(authCode, response.data.url, function (error, data) {
                            cb(error, data, response.data.url);
                        })
                    })
                }
            });
        } else {
            cb({ message: response.data.message }, null, null)
        }
    }).catch(err => {
        cb({ message: 'networkError' }, null, null)
        console.log('caught you')
    });
}

export function getClientToken(authCode, address, cb) {
    axios.post(`${address}/client/token`, { 'auth_code': authCode, 'address': address })
        .then((response) => {
            if (response.data.success) {
                localStorage.setItem('access_token', `${response.data.token}`);
                cb(null, true)
            } else {
                cb({ message: response.data.message || 'Wrong details' }, null)
            }
        })
}


export function getConfig(cb) {
    try {
        fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
            if (err) {
                console.log("Er..", err);
                err.toString().includes('ENOENT') ?
                    fs.writeFile(CONFIG_FILE, JSON.stringify({ isConnected: false }), function (Er) { })
                    : null;
                cb(err, null);
            }
            else {
                cb(null, data);
            }
        });
    } catch (Err) {
        cb(Err)
    }
}