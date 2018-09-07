import axios from 'axios';
import { B_URL } from '../Constants/constants'
import { CONFIG_FILE } from '../Utils/utils';
import { VPN_USAGE } from '../Constants/action.names'
const fs = window.require('fs');
const electron = window.require('electron');
const remote = electron.remote;
const { execSync } = window.require('child_process');
const os = window.require('os');
const netStat = window.require('net-stat');


export function sendUsage(accountAddr, usage) {
    let uri = `${B_URL}/client/update-connection`;
    let connections = [{
        'usage': usage,
        'client_addr': accountAddr,
        'session_name': localStorage.getItem('SESSION_NAME')
    }];
    let data = {
        'account_addr': localStorage.getItem('CONNECTED_VPN'),
        'connections': connections
    };

    axios.post(uri, data).then(res => { console.log(res.data, "usage submitted to master node") });
}

export function setStartValues(downVal, upVal) {
    fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
        if (err) { }
        else {
            let configData = JSON.parse(data);
            configData.startDown = downVal;
            configData.startUp = upVal;
            localStorage.setItem('startDown', downVal);
            localStorage.setItem('startUp', upVal);
            let config = JSON.stringify(configData);
            fs.writeFile(CONFIG_FILE, config, (err) => { });
        }
    });
}

export const calculateUsage = (localAddr, value, cb) => {
    if (remote.process.platform === 'win32') {
        const abspath = 'C:\\Windows\\System32\\wbem\\WMIC.exe';
        const cmd = 'path Win32_PerfRawData_Tcpip_NetworkInterface Get name,BytesReceivedPersec,BytesSentPersec,BytesTotalPersec /value';

        let downCur;
        let upCur;
        let usage;
        let bwStats = {
            iface: '',
            down: 0,
            up: 0
        };
        let data = execSync(`${abspath} ${cmd}`).toString();
        data = data.trim().split(/\n\s*\n/);
        let interfaces = os.networkInterfaces();

        Object.keys(interfaces).map((key) => {
            if (key === 'WiFi') {
                bwStats['iface'] = key;
                bwStats['down'] = data[1].split('\n')[0].split('=')[1].trim();
                bwStats['up'] = data[1].split('\n')[1].split('=')[1].trim();
            } else if (key === 'Ethernet') {
                bwStats['iface'] = key;
                bwStats['down'] = data[0].split('\n')[0].split('=')[1].trim();
                bwStats['up'] = data[0].split('\n')[1].split('=')[1].trim();
            }

        });
        downCur = parseInt(bwStats.down);
        upCur = parseInt(bwStats.up);
        if (value) {
            usage = {
                'down': 0,
                'up': 0
            };
            setStartValues(downCur, upCur);
        }
        else {
            let downDiff = downCur - localStorage.getItem('startDown');
            let upDiff = upCur - localStorage.getItem('startUp');
            usage = {
                'down': downDiff,
                'up': upDiff
            };
        }
        sendUsage(localAddr, usage);
        cb(usage);
    }
    else {
        let loopStop = false;
        let interfaces = os.networkInterfaces();
        Object.keys(interfaces).map((key) => {
            if (loopStop) { }
            else {
                let obj = interfaces[key].find(o => { return (o.family === 'IPv4' && !o.internal) });
                if (obj) {
                    let usage;
                    let downCur;
                    let upCur;
                    if (remote.process.platform === 'darwin') {
                        let cmd = `netstat -b -i | grep ${obj.address} | awk '{print $7" "$8}'`;
                        let output = execSync(cmd);
                        let values = output.toString().trim().split(" ");
                        downCur = values[0];
                        upCur = values[1];
                    }
                    else {
                        downCur = netStat.totalRx({ iface: key });
                        upCur = netStat.totalTx({ iface: key })
                    }
                    if (value) {
                        usage = {
                            'down': 0,
                            'up': 0
                        };
                        setStartValues(downCur, upCur);
                    }
                    else {
                        let downDiff = downCur - localStorage.getItem('startDown');
                        let upDiff = upCur - localStorage.getItem('startUp');
                        usage = {
                            'down': downDiff,
                            'up': upDiff
                        };
                    }
                    sendUsage(localAddr, usage);
                    loopStop = true;
                    console.log("True..", usage);
                    cb(usage);
                }
            }
        })
    }
};


export function socksVpnUsage(usage) {
    console.log("Hello...socks")
    let response = {
        data: {
            success: true,
            usage: usage
        }
    }
    return {
        payload: response,
        type: VPN_USAGE
    };
}

export function getStartValues() {
    fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
        var configData = JSON.parse(data);
        var downVal = configData.startDown ? configData.startDown : 0;
        var upVal = configData.startUp ? configData.startUp : 0;
        localStorage.setItem('startDown', downVal);
        localStorage.setItem('startUp', upVal);
    })
}