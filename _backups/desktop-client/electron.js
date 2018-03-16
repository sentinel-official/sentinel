const url = require('url');
const path = require('path');
const electron = require('electron');
const { app, BrowserWindow } = electron;
const { exec } = require('child_process');


function stopVPN() {
  exec('pidof openvpn', (err, stdout, stderr) => {
    if (err) console.log(err);
    else if (stdout) {
      let pids = stdout.trim();
      let command = 'kill -2 ' + pids;
      exec(command, (err, stdout, stderr) => {
        console.log(err, stdout, stderr);
      });
    }
  });
}

function windowManager() {
  this.window = null;

  this.createWindow = () => {
    this.window = new BrowserWindow();
    this.window.loadURL(url.format({
      pathname: path.join(__dirname, 'src/index.html'),
      protocol: 'file:',
      slashes: true
    }));
    this.window.on('closed', () => {
      stopVPN();
      this.window = null;
    });
  }
}

const mainWindow = new windowManager();

app.on('ready', mainWindow.createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow.window === null) {
    mainWindow.createWindow();
  }
});
