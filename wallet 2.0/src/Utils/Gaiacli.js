const electron = window.require('electron');
const { exec, execSync } = window.require('child_process');
const remote = electron.remote;
const path = window.require('path');

export function runGaiacli(cb) {
    if (remote.process.platform === 'linux') {
        try {
            execSync('chmod +x public/gaiacli');
            exec('public/gaiacli advanced rest-server --node tcp://209.182.217.171:26657 --chain-id=Sentinel-dev-testnet',
                function (err, stdout, stderr) {
                    if (err) {
                        cb(true)
                    }
                    else {
                        cb(false)
                    }
                })
        } catch (error) {
            cb(true);
        }
    } else if (remote.process.platform === 'darwin') {
        try {
            let gaiacliPath = path.join(remote.process.resourcesPath, 'gaiacli');
            execSync(`chmod +x ${gaiacliPath}`);
            exec(`${gaiacliPath} advanced rest-server --node tcp://209.182.217.171:26657 --chain-id=Sentinel-dev-testnet`,
                function (err, stdout, stderr) {
                    if (err) {
                        cb(true)
                    }
                    else {
                        cb(false)
                    }
                })
        } catch (error) {
            cb(true);
        }
    }
    else {
        exec('resources\\extras\\gaiacli.exe advanced rest-server --node tcp://209.182.217.171:26657 --chain-id=Sentinel-dev-testnet',
            function (err, stdout, stderr) {
                if (err) {
                    cb(true)
                }
                else {
                    cb(false)
                }
            })
    }
}