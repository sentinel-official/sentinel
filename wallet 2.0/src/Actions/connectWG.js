import { checkDependencies, getUserHome, getWireguardTM } from '../Utils/utils';
const SENT_DIR = getUserHome() + '/.sentinel';
const WIREGUARD_CONFIG_FILE = SENT_DIR + '/wg0.conf';
const fs = window.require('fs');
const { exec } = window.require('child_process');


export async function connectWireguard(account_addr, vpn_addr, os, data, cb) {
    // console.log("in connectWireguard");
        checkWireguardDependencies(os, (otherErr, winErr) => {
            if (otherErr) cb(otherErr, false, null);
            else if (winErr) cb(null, winErr, null);
            else {
                if (localStorage.getItem('isTM') === 'true') { 
                    tmWireguardConnect(account_addr, vpn_addr, data, (err, res) => {
                        cb(err, false, res)
                    });
                }
            }
        })

}

export async function checkWireguardDependencies(os, cb) {
    switch (os) {
        case 'linux': {
            checkDependencies(['wireguard'], (e, o, se) => {
                if (o) cb(null, null);
                else cb({ message: "Wireguard Not Installed." }, null);
            })
            break;
        }
        default: {
            cb({ message: "Can't detect current os platform." }, null)
            break;
        }
    }
}

export async function tmWireguardConnect(account_addr, vpn_data, session_data, cb) {
    // console.log("in TMWGConnect")
    getWireguardTM(account_addr, vpn_data, session_data, (err) => {
      
        if (err) {
            // console.log("getting err in tmwg connect", err)
            cb(err, null);
        }
        else {
            // console.log("no err in conecting tmwg")
            let resp = {
                success: true,
                message: 'Connected To Wireguard'
            }
            connectwithWireguard(resp, (error, response) => {
                cb(error, response);
            });
        }
    })
}

export async function connectwithWireguard(resp, cb) {
    // console.log("trying to connect WG in WG")
    let pk = '', pubg = '';
    exec('cat privateKeyFile', function (err, stdout, stderr) {
        if (err) { 
            // console.log("private key  err")
         }
        if (stdout) {
            pk = stdout
            // console.log("client private fetched ", pk)
            fs.readFile(WIREGUARD_CONFIG_FILE, 'utf8', function (err, data) {
                if (err) {
                    console.log("in if")
                    err.toString().includes('ENOENT') ?
                        fs.writeFile(WIREGUARD_CONFIG_FILE, (

                            `[Interface] \n Address = ${localStorage.getItem('WG_IP')} \n PrivateKey = ${pk} \n [Peer] \n  Publickey = ${localStorage.getItem('WG_PUBKEY')}\n Endpoint = ${localStorage.getItem('WG_ENDPOINT')} \n AllowedIPs = ${localStorage.getItem('WG_ALLOWEDIPS')} \n PersistentKeepalive = ${localStorage.getItem('WG_PERSISTENT')}`

                            // `[Interface] \n Address = 10.0.0.3/32 \n PrivateKey = ${pk} \n [Peer] \n  Publickey = l59DUgGPWA05eUEGoPZtX14ZKTdsNom/G5QfSri12Cc= \n Endpoint = 35.200.183.162:5253 \n AllowedIPs = 0.0.0.0/0 \n PersistentKeepalive = 21`
                        ), function (e) {
                            if (e) throw e;
                            else {
                                // console.log("copying...");
                                exec(`cp "${WIREGUARD_CONFIG_FILE}" /etc/wireguard && wg-quick up wg0`, function (err, stdout, stderr) {
                                    // console.log("step3")
                                    // if (err) { console.log("normal err") }
                                    // if (stdout) { console.log("wg outpt", stdout) }
                                    // if (stderr) { console.log("stderr", stderr) }
                                })
                            }

                        })
                        : null
                    cb(err, null)
                }
                else {
                    // console.log("in else")
                    fs.writeFile(WIREGUARD_CONFIG_FILE, (
                        `[Interface] \n Address = ${localStorage.getItem('WG_IP')} \n PrivateKey = ${pk} \n [Peer] \n Publickey = ${localStorage.getItem('WG_PUBKEY')}\n Endpoint = ${localStorage.getItem('WG_ENDPOINT')} \n AllowedIPs = ${localStorage.getItem('WG_ALLOWEDIPS')} \n PersistentKeepalive = ${localStorage.getItem('WG_PERSISTENT')}`
                        ),
                        function (e) {
                            if (e) throw e;

                            else {
                                // console.log("copying...");
                                exec(`cp "${WIREGUARD_CONFIG_FILE}" /etc/wireguard && wg-quick up wg0`, function (err, stdout, stderr) {
                                    // console.log("step3")
                                    // if (err) { console.log("normal err") }
                                    // if (stdout) { console.log("wg outpt", stdout) }
                                    // if (stderr) { console.log("stderr", stderr) }
                                })
                            }

                        })

                    cb(null, "local WG Node is up")
                }
            })

        }
        if (stderr) { 
            // console.log("stderr1", stderr)
         }
    })
    // exec(` cat privateKeyFile`, function (a, b, c) {
    //     if (b) { console.log("logging..", b); }

    // })

}



