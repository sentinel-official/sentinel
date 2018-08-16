import axios from 'axios';

const fs = window.require('fs');
const electron = window.require('electron');
const { exec, execSync } = window.require('child_process');
const remote = electron.remote;
const SENT_DIR = getUserHome() + '/.sentinel';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
let SESSION_NAME = '';
let IPGENERATED = '';
let LOCATION = '';
let SPEED = '';
let CONNECTED_VPN = '';


if (!fs.existsSync(SENT_DIR)) fs.mkdirSync(SENT_DIR);
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
                        throw err || stderr ;
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
            if (response.success) {
                if (response['node'] === null) {
                    cb({message: 'Something wrong. Please Try Later'})
                }
                else {
                    if (remote.process.platform === 'win32' || remote.process.platform === 'darwin') {
                        delete (response['node']['vpn']['ovpn'][17]);
                        delete (response['node']['vpn']['ovpn'][18]);
                    }
                    let ovpn = response['node']['vpn']['ovpn'].join('');
                    SESSION_NAME = response['session_name'];
                    CONNECTED_VPN = vpn_addr;
                    IPGENERATED = response['node']['vpn']['ovpn'][3].split(' ')[1];
                    LOCATION = response['node']['location']['city'];
                    SPEED = Number(response['node']['net_speed']['download'] / (1024 * 1024)).toFixed(2) + ' Mbps';
                    fs.writeFile(OVPN_FILE, ovpn, function (err) {
                        if (err) cb(err);
                        else cb(null);
                    });
                }
            } else {
                cb({message: response.message || 'Error occurred while getting OVPN file, may be empty VPN resources.'})
            }
        })
    }
}
