const url = require('url');
const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Menu, dialog } = electron;
var i18n = new (require('./translations/i18n'));
const remote = electron.remote;
var { exec } = require('child_process');
var sudo = require('sudo-prompt');
var disconnect = {
  name: 'DisconnectOpenVPN'
};
var showPrompt = true;

function windowManager() {
  this.window = null;

  this.createWindow = () => {
    if (process.platform === 'win32') screenHeight = 700;
    else screenHeight = 672;
    this.window = new BrowserWindow({ title: "Sentinel-alpha-0.0.3", resizable: false, width: 1000, height: screenHeight, icon: './public/icon256x256.png' });
    this.window.loadURL(url.format({
      pathname: path.join(__dirname, 'build/index.html'),
      protocol: 'file:',
      slashes: true
    }));

    this.window.on('close', (e) => {
      if (process.platform === 'win32') {
        e.preventDefault();
        stopVPN();
        this.window.hide();
      }
      else {
        let self = this;
        isVPNConnected(function (isConnected) {
          console.log("vpn..", isConnected)
          if (showPrompt && isConnected) {
            // e.preventDefault();
            let res = dialog.showMessageBox({
              type: 'question',
              buttons: ['Disconnect', 'Run in Background'],
              title: 'Confirm',
              message: 'You are currently connected to a VPN'
            })
            console.log('resp..', res);
            if (!res) {
              showPrompt = false;
              stopVPN();
              console.log("In quit")
              self.window = null;
              app.quit();
            }
            else {
              self.window = null;
              showPrompt = false;
              app.quit();
            }
          }
        });
      }
    });
  }
}

function isVPNConnected(cb) {
  if (process.platform === 'win32') {
    exec('tasklist /v /fo csv | findstr /i "openvpn.exe"', function (err, stdout, stderr) {
      if (stdout.toString() === '') {
        cb(false)
      }
      else {
        cb(true)
      }
    })
  }
  else {
    exec('pidof openvpn', function (err, stdout, stderr) {
      if (stdout) {
        console.log('stdout..', stdout)
        cb(true);
      }
      else {
        cb(false);
      }
    });
  }
}

function stopVPN() {
  if (process.platform === 'win32') {
    console.log("on close");
    sudo.exec('taskkill /IM sentinel.exe /f && taskkill /IM openvpn.exe /f', disconnect,
      function (error, stdout, stderr) {
        console.log("In exec");
      });
  }
  else {
    exec('pidof openvpn', (err, stdout, stderr) => {
      console.log(stdout)
      if (stdout) {
        let pids = stdout.trim();
        let command = 'kill -2 ' + pids;
        exec(command, (err, stdout, stderr) => {
        });
      }
    });
  }
}

const template = [{
  label: i18n.__('View'),
  submenu: [

    {
      role: 'toggledevtools', label: i18n.__('Toggle Developer Tools')
    }
  ]
}

]

const mainWindow = new windowManager();

app.on('ready', mainWindow.createWindow);
app.on('ready', function () {
  const templates = [{
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
      { label: "Quit", accelerator: "CmdOrCtrl+Q", selector: "quit:", role: 'close' },
      {
        role: 'toggledevtools', label: i18n.__('Toggle Developer Tools')
      }
    ]
  }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(templates))
})

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow.window === null) {
    mainWindow.createWindow();
  }
});