const electron = window.require('electron');
const { exec, execSync } = window.require('child_process');
const remote = electron.remote;

export function runGaiacli() {
    if (remote.process.platform === 'linux') {
        execSync('chmod +x public/gaiacli');
        exec('public/gaiacli advanced rest-server --node tcp://51.38.242.121:26657',function(err,stdout,stderr){
            console.log('Command..',err,stdout,stderr)
        })
    }
}