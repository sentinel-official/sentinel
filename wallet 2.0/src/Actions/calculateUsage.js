import axios from 'axios';
import { B_URL } from '../Constants/constants'
import { CONFIG_FILE } from '../Utils/utils'
const fs = window.require('fs');
const electron = window.require('electron');
const remote = electron.remote;
const { execSync } = window.require('child_process');
const os = window.require('os');
const netStat = window.require('net-stat');

let stats = {};


export function sendUsage(accountAddr, vpnAddr, usage) {
    let uri = `${B_URL}/client/update-connection`;
    let connections = [{
        'usage': usage,
        'client_addr': accountAddr,
        'session_name': localStorage.getItem('SESSION_NAME')
    }];
    let data = {
        'account_addr': vpnAddr,
        'connections': connections
    };

    axios.post(uri, data).then(res => { console.log(res.data, "usage submitted to master node") });
}

export function setStartValues(downVal, upVal) {
    fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
        if (err) {}
        else {
            let configData = JSON.parse(data);
            configData.startDown = downVal;
            configData.startUp = upVal;
            let config = JSON.stringify(configData);
            fs.writeFile(CONFIG_FILE, config, (err) => {  });
        }
    });
}

export const calculateUsage = (localAddr, selectedVpn, value) => {
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
            if(key === 'WiFi') {
                bwStats['iface'] = key;
                bwStats['down'] = data[1].split('\n')[0].split('=')[1].trim();
                bwStats['up'] = data[1].split('\n')[1].split('=')[1].trim();
            } else if ( key === 'Ethernet' ) {
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
            stats["startDownload"] = downCur;
            stats["startUpload"] = upCur;
            stats["usage"] = usage;

        }
        else {
            let downDiff = downCur - stats.startDownload;
            let upDiff = upCur - stats.startUpload;
            usage = {
                'down': downDiff,
                'up': upDiff
            };
            stats.usage = usage;
        }
        sendUsage(localAddr, selectedVpn, usage);
        return stats;
    }
    else {
        let loopStop = false;
        let interfaces = os.networkInterfaces();
        Object.keys(interfaces).map((key) => {
            if (loopStop) {}
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
                        stats = {
                            'startDownload': downCur,
                            'startUpload': upCur,
                            'usage': usage
                        };
                    }
                    else {
                        let downDiff = downCur - stats.startDownload;
                        let upDiff = upCur - stats.startUpload;
                        usage = {
                            'down': downDiff,
                            'up': upDiff
                        };
                        stats = { 'usage': usage }
                    }
                    sendUsage(localAddr, selectedVpn, usage);
                    loopStop = true;
                    return stats
                }
            }
        })
    }
};
