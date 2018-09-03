import axios from 'axios';
import { VPN_USAGE } from '../Constants/action.names'
import { B_URL } from '../Constants/constants'
const fs = window.require('fs');
const electron = window.require('electron');
const { exec, execSync } = window.require('child_process');
const remote = electron.remote;
const SENT_DIR = getUserHome() + '/.sentinel';
const TM_DIR = getUserHome() + '/.sentinel/.tendermint';
const OVPN_FILE = SENT_DIR + '/client.ovpn';


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
        axios.post(uri, data).then(response => {
            console.log(response, 'session data')
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
                    // if (remote.process.platform === 'win32' || remote.process.platform === 'darwin') {
                    //     delete (response.data['node']['vpn']['ovpn'][17]);
                    //     delete (response.data['node']['vpn']['ovpn'][18]);
                    // }
                    // let ovpn = response.data['node']['vpn']['ovpn'].join('');
                    // localStorage.setItem('SESSION_NAME', response.data['session_name']);
                    // localStorage.setItem('CONNECTED_VPN', vpn_addr);
                    // localStorage.setItem('IPGENERATED', response.data['node']['vpn']['ovpn'][3].split(' ')[1]);
                    // localStorage.setItem('LOCATION', response.data['node']['location']['city']);
                    // localStorage.setItem('SPEED', Number(response.data['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + ' Mbps');
                    // fs.writeFile(OVPN_FILE, ovpn, function (err) {
                    //     if (err) cb(err);
                    //     else cb(null);
                    // });
                }
            } else {
                cb({ message: response.data.message || 'Error occurred while getting OVPN file, may be empty VPN resources.' })
            }
        })
    }
}

export function ovpnSave(vpn_data, session_id, ovpn, cb) {
    if (remote.process.platform === 'win32' || remote.process.platform === 'darwin') {
        delete (ovpn[17]);
        delete (ovpn[18]);
    }
    let joinedOvpn = ovpn.join('');
    localStorage.setItem('SESSION_NAME', session_id);
    localStorage.setItem('CONNECTED_VPN', vpn_data.vpn_addr);
    localStorage.setItem('IPGENERATED', ovpn[3].split(' ')[1]);
    localStorage.setItem('LOCATION', vpn_data.city);
    localStorage.setItem('SPEED', Number(vpn_data.speed / (1024 * 1024)).toFixed(2) + ' Mbps');
    fs.writeFile(OVPN_FILE, joinedOvpn, function (err) {
        if (err) cb(err);
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
    if (localStorage.getItem('isTM')) {
        let url = localStorage.getItem('TM_VPN_URL');
        uri = url + '/client/usage';
        data = {
            account_addr: account_addr,
            session_id: localStorage.getItem('SESSION_NAME'),
            token: localStorage.getItem('TOKEN')
        }
    }
    else {
        uri = `${B_URL}/client/vpn/current`;
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


export function getVPNPIDs(cb) {
    try {
        exec('pidof openvpn', function (err, stdout, stderr) {
            if (err) cb(err, null);
            else if (stdout) {
                let pids = stdout.trim();
                cb(null, pids);
            }
            else {
                cb(true, null);
            }
        });
    } catch (Err) {
        cb(Err)
    }
}
