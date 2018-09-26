const electron = window.require('electron');
const { exec, execSync } = window.require('child_process');
const remote = electron.remote;
const path = window.require('path');

export function runGaiacli() {
    if (remote.process.platform === 'linux') {
        execSync('chmod +x /usr/lib/sentinel/public/gaiacli');
        exec('/usr/lib/sentinel/public/gaiacli advanced rest-server --node tcp://185.222.24.68:26657 --chain-id=Sentinel-testnet-1',
            function (err, stdout, stderr) {

            })
    } else if (remote.process.platform === 'darwin') {
        let gaiacliPath = path.join(remote.process.resourcesPath, 'gaiacli');
        execSync(`chmod +x ${gaiacliPath}`);
        exec(`${gaiacliPath} advanced rest - server--node tcp://185.222.24.68:26657 --chain-id=Sentinel-testnet-1`,
            function (err, stdout, stderr) {

            })
    }
    else {
        exec('resources\\extras\\gaiacli.exe advanced rest-server --node tcp://185.222.24.68:26657 --chain-id=Sentinel-testnet-1',
            function (err, stdout, stderr) { })
    }
}