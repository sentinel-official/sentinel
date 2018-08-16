import axios from 'axios';
import { CONNECT_VPN } from '../Constants/action.names';
import { checkDependencies, getOVPNAndSave, getUserHome } from '../Utils/utils'


const B_URL = 'https://api.sentinelgroup.io';
const electron = window.require('electron');
const remote = electron.remote;
const sudo = remote.require('sudo-prompt');
const SENT_DIR = getUserHome() + '/.sentinel';
const OVPN_FILE = SENT_DIR + '/client.ovpn';
const fs = require('fs');
const { exec, execSync } = window.require('child_process');
let connect = {
    name: 'ConnectOpenVPN'
};
let OVPNDelTimer = null;

export function connectVPN(account_addr, vpn_addr, os, cb) {
    switch (os) {
        case 'win32': {

            }
        case 'darwin': {

            }
        case 'linux': {
            checkDependencies(['openvpn'], (e, o, se) => {
                if ( o ) {
                    testConnect(account_addr, vpn_addr, (res) => { cb(res) });
                } else {
                    console.log("dependecy error")
                }
            })
            }
        default: {

        }
    }
}


export function testConnect(account_addr, vpn_addr, cb) {
    let data = {
        account_addr: account_addr,
        vpn_addr: vpn_addr
    };
    let command;
    if (remote.process.platform === 'darwin') {
        let ovpncommand = 'export PATH=$PATH:/usr/local/opt/openvpn/sbin && openvpn ' + OVPN_FILE;
        command = `/usr/bin/osascript -e 'do shell script "${ovpncommand}" with administrator privileges'`
    } else if (remote.process.platform === 'win32') {
        command = 'resources\\extras\\bin\\openvpn.exe ' + OVPN_FILE;
    } else {
        command = 'sudo openvpn ' + OVPN_FILE;
    }


    axios.post(`${B_URL}/client/vpn`, data)
        .then(resp => {
            // console.log(resp, 'res') ;
            if (resp.success) {
                getOVPNAndSave(account_addr, resp['ip'], resp['port'], resp['vpn_addr'], resp['token'],  (err) => {
                    if (err) cb(err, false, false, false, null);
                    else {
                        if (OVPNDelTimer) clearInterval(OVPNDelTimer);
                        if (remote.process.platform === 'win32') {
                            sudo.exec(command, connect,
                                function (error, stdout, stderr) {
                                    console.log('Err...', error, 'Stdout..', stdout, 'Stderr..', stderr)
                                    OVPNDelTimer = setTimeout(function () {
                                        fs.unlinkSync(OVPN_FILE);
                                    }, 5 * 1000);
                                }
                            );
                        } else {
                            exec(command, function (err, stdout, stderr) {
                                OVPNDelTimer = setTimeout(function () {
                                    fs.unlinkSync(OVPN_FILE);
                                }, 1000);
                            });
                        } // internal else ends here
                    } // parent else ends here
                })
                } else {
                // sendError(res);
                // return {
                //     payload: resp,
                //     type: CONNECT_VPN
                // }
                if (resp.data.account_addr)
                    cb(resp);
                else
                    cb({ message: resp.data.message || 'Connecting VPN Failed. Please Try Again' });
            }
        })
        .catch(err => { console.log(err) })

}

function installPackage(packageName, cb) {
    try {
        exec(`brew install ${packageName}`,
            function (err, stdout, stderr) {
                console.log("Installing: ", packageName, err, stdout, stderr);
                if (err || stderr) cb(err || stderr, false);
                else cb(null, true);
            });
    } catch (Err) {
        throw Err
    }
}
