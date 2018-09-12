const electron = window.require('electron');
const { exec, execSync } = window.require('child_process');
const remote = electron.remote;

export function runGaiacli() {
    if (remote.process.platform === 'linux') {
        execSync('chmod +x public/gaiacli');
        exec('public/gaiacli advanced rest-server --node tcp://185.222.24.68:26657 --chain-id=Sentinel-testnet-1',function(err,stdout,stderr){
            
        })
    }
}