const url = require('url');
const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Menu, dialog, ipcMain } = electron;
var i18n = new (require('./translations/i18n'));
const remote = electron.remote;
var { exec, execSync } = require('child_process');
var sudo = require('sudo-prompt');
const fs = require('fs');
var disconnect = {
  name: 'DisconnectOpenVPN'
};

if (process.env.ELECTRON_START_URL) {
  require('electron-reload')(__dirname)
}

var showPrompt = true;
var showTmPrompt = true;
var vpnType = 'openvpn';
const SENT_DIR = getUserHome() + '/.sentinel';
const CONFIG_FILE = SENT_DIR + '/config';

if (!fs.existsSync(SENT_DIR)) fs.mkdirSync(SENT_DIR);
function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

function windowManager() {
  this.window = null;

  this.createWindow = () => {
    if (process.platform === 'win32') screenHeight = 700;
    else screenHeight = 672;
    this.window = new BrowserWindow({ title: "Sentinel Network - dVPN - alpha-0.1.2", resizable: false, maximizable: false, width: 1000, height: screenHeight, icon: './public/icon256x256.png' });
    this.window.loadURL(url.format({
      pathname: path.join(__dirname, 'build/index.html'),
      protocol: 'file:',
      slashes: true
    }));

    this.window.on('close', async (e) => {
      let self = this;
      let isTM = false;
      e.preventDefault();
      let event = e;
      if (mainWindow.window) {
        isTM = await getTmLocal();
      }
      showTmPrompt = true;
      if (isTM === 'true') {
        isTMVPNConnected(function (isConnected) {
          if (showTmPrompt && isConnected) {
            // e.preventDefault();
            let res = dialog.showMessageBox({
              type: 'question',
              buttons: ['OK', 'Cancel'],
              title: 'Confirm',
              message: 'Do you want to disconnect the current dVPN Session and close the app?'
            })
            if (!res) {
              showTmPrompt = false;
              stopVPN(function (err) {
                if (process.platform === 'win32')
                  exec('taskkill /IM gaiacli.exe /F', (err, std, sto) => { });
                else
                  exec('killall gaiacli', (err, std, sto) => { });
                self.window = null;
                event.defaultPrevented = false;
                app.quit();
              });
            }
            else {
              // self.window = null;
              showTmPrompt = false;
              event.defaultPrevented = false;
              // app.quit();
            }
          }
          else {
            if (process.platform === 'win32')
              exec('taskkill /IM gaiacli.exe /F', (err, std, sto) => { });
            else
              exec('killall gaiacli', (err, std, sto) => { });
            self.window = null;
            showTmPrompt = false;
            e.defaultPrevented = false;
            app.quit();
          }
        })
      } else {
        isVPNConnected((isConnected) => {
          if (process.platform === 'win32')
            exec('taskkill /IM gaiacli.exe /F', (err, std, sto) => { });
          else
            exec('killall gaiacli', (err, std, sto) => { });
          if (showPrompt && isConnected) {
            // e.preventDefault();
            let res = dialog.showMessageBox({
              type: 'question',
              buttons: ['Disconnect', 'Run in Background'],
              title: 'Confirm',
              message: 'You are currently connected to a VPN'
            })
            if (!res) {
              showPrompt = false;
              stopVPN(function (err) {
                self.window = null;
                event.defaultPrevented = false;
                app.quit();
              });
            }
            else {
              self.window = null;
              showPrompt = false;
              event.defaultPrevented = false;
              app.quit();
            }
          }
          else {
            self.window = null;
            showPrompt = false;
            event.defaultPrevented = false;
            app.quit();
          }
        });
      }
    });
  }
}


function getTmLocal() {
  return mainWindow.window.webContents.executeJavaScript(`localStorage.getItem('isTM')`).then(
    (value) => {
      return value;
    }
  )
}

function getConfig(cb) {
  fs.readFile(CONFIG_FILE, function (err, data) {
    if (err) cb(err, null);
    else {
      cb(null, data);
    }
  });
}

function isVPNConnected(cb) {
  if (process.platform === 'win32') {
    try {
      let stdout = execSync('tasklist /v /fo csv | findstr /i "openvpn.exe"');
      if (stdout) {
        cb(true)
      }
      else {
        let stdOutput = execSync('tasklist /v /fo csv | findstr /i "Shadowsocks.exe"');
        if (stdOutput) {
          vpnType = 'socks5';
          cb(true)
        }
        else {
          cb(false)
        }
      }
    } catch (err) {
      try {
        let stdOutput = execSync('tasklist /v /fo csv | findstr /i "Shadowsocks.exe"');
        if (stdOutput) {
          vpnType = 'socks5'
          cb(true);
        }
        else {
          cb(false);
        }
      } catch (error) {
        cb(false)
      }
    }
  }
  else {
    try {
      let stdout = execSync('pidof openvpn').toString();
      if (stdout) {
        cb(true);
      }
      else {
        let stdOutput = execSync('pidof ss-local').toString();
        if (stdOutput) {
          vpnType = 'socks5'
          cb(true);
        }
        else {
          cb(false);
        }
      }
    } catch (err) {
      try {
        let stdOutput = execSync('pidof ss-local').toString();
        if (stdOutput) {
          vpnType = 'socks5'
          cb(true);
        }
        else {
          cb(false);
        }
      } catch (error) {
        cb(false)
      }
    }
  }
}

function isTMVPNConnected(cb) {
  if (process.platform === 'win32') {
    try {
      let stdout = execSync('tasklist /v /fo csv | findstr /i "openvpn.exe"');
      if (stdout) {
        cb(true)
      }
      else {
        cb(false)
      }
    } catch (err) {
      cb(false)
    }
  }
  else {
    try {
      let stdout = execSync('pidof openvpn').toString();
      if (stdout) {
        cb(true);
      }
      else {
        cb(false);
      }
    } catch (err) {
      cb(false)
    }
  }
}

function stopVPN(cb) {
  if (process.platform === 'win32') {
    try {
      var cmd;
      if (vpnType === 'socks5')
        cmd = 'net stop sentinelSocksv11 /f  && taskkill /IM sentinel.exe /f'
      else cmd = 'taskkill /IM openvpn.exe /f  && taskkill /IM sentinel.exe /f';
      let stdout = execSync(cmd)
      if (stdout) cb(null);
      else {
        try {
          getConfig(function (error, KEYSTOREDATA) {
            let data;
            try {
              data = JSON.parse(KEYSTOREDATA);
            } catch (e) {
              data = {}
            }
            data.isConnected = null;
            let keystore = JSON.stringify(data);
            fs.writeFile(CONFIG_FILE, keystore, function (keyErr) {
            });
            cb(null);
          })
        } catch (err) {
          cb(null);
        }
      }
    } catch (err) {
      cb(null);
    }
  }
  else {
    try {
      var cmd;
      if (vpnType === 'socks5')
        cmd = 'pidof ss-local'
      else cmd = 'pidof openvpn';
      let stdout = execSync(cmd).toString();
      if (stdout) {
        let pids = stdout.trim();
        let command = 'kill -2 ' + pids;
        if (process.platform === 'darwin') {
          command = `/usr/bin/osascript -e 'do shell script "${command}" with administrator privileges'`
        }
        try {
          let output = execSync(command).toString();
          if (process.platform === 'darwin') {
            let netcmd = `services=$(networksetup -listnetworkserviceorder | grep 'Hardware Port'); while read line; do sname=$(echo $line | awk -F  "(, )|(: )|[)]" '{print $2}'); sdev=$(echo $line | awk -F  "(, )|(: )|[)]" '{print $4}'); if [ -n "$sdev" ]; then ifout="$(ifconfig $sdev 2>/dev/null)"; echo "$ifout" | grep 'status: active' > /dev/null 2>&1; rc="$?"; if [ "$rc" -eq 0 ]; then currentservice="$sname"; currentdevice="$sdev"; currentmac=$(echo "$ifout" | awk '/ether/{print $2}'); fi; fi; done <<< "$(echo "$services")"; if [ -n "$currentservice" ]; then echo $currentservice; else >&2 echo "Could not find current service"; exit 1; fi`;
            let stdoutput = execSync(netcmd).toString();
            if (stdoutput) {
              var currentService = stdoutput.trim();
              let runOut = execSync(`networksetup -setsocksfirewallproxystate '${currentService}' off`);
            }
          }
          getConfig(function (error, KEYSTOREDATA) {
            let data;
            try {
              data = JSON.parse(KEYSTOREDATA);
            } catch (e) {
              data = {}
            }
            data.isConnected = null;
            let keystore = JSON.stringify(data);
            fs.writeFile(CONFIG_FILE, keystore, function (keyErr) {
            });
            cb(null);
          })
        } catch (err) {
          cb(null);
        }
      }
      else {
        cb(null);
      }
    }
    catch (err) {
      cb(null);
    }
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
  var m = Menu.buildFromTemplate([{
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
      },
    ]
  },
  {
    label: "Language",
    submenu: [
      {
        label: 'English', type: 'checkbox', checked: true, click() {
          m.items[1].submenu.items[0].checked = true;
          m.items[1].submenu.items[1].checked = false;
          m.items[1].submenu.items[2].checked = false;
          // m.items[1].submenu.items[2].checked = false;
          // m.items[1].submenu.items[3].checked = false;
          // m.items[1].submenu.items[4].checked = false;
          // m.items[1].submenu.items[5].checked = false;
          mainWindow.window.webContents.send('lang', 'en');
        }
        // },
        // {
        //   label: 'Japanese', type: 'checkbox', checked: false, click() {
        //     m.items[1].submenu.items[0].checked = false;
        //     m.items[1].submenu.items[1].checked = true;
        //     m.items[1].submenu.items[2].checked = false;
        //     m.items[1].submenu.items[3].checked = false;
        //     m.items[1].submenu.items[4].checked = false;
        //     m.items[1].submenu.items[5].checked = false;
        //     mainWindow.window.webContents.send('lang', 'ja');
        //   }
        // }, {
        //   label: 'Spanish', type: 'checkbox', checked: false, click() {
        //     m.items[1].submenu.items[0].checked = false;
        //     m.items[1].submenu.items[1].checked = false;
        //     m.items[1].submenu.items[2].checked = true;
        //     m.items[1].submenu.items[3].checked = false;
        //     m.items[1].submenu.items[4].checked = false;
        //     m.items[1].submenu.items[5].checked = false;
        //     mainWindow.window.webContents.send('lang', 'es');
        //   }
      }, {
        label: 'Chinese', type: 'checkbox', checked: false, click() {
          m.items[1].submenu.items[0].checked = false;
          m.items[1].submenu.items[1].checked = true;
          m.items[1].submenu.items[2].checked = false;
          // m.items[1].submenu.items[2].checked = false;
          // m.items[1].submenu.items[3].checked = false;
          // m.items[1].submenu.items[4].checked = true;
          // m.items[1].submenu.items[5].checked = false;
          mainWindow.window.webContents.send('lang', 'zh');
        }
      }, {
        label: 'Russian', type: 'checkbox', checked: false, click() {
          m.items[1].submenu.items[0].checked = false;
          m.items[1].submenu.items[1].checked = false;
          m.items[1].submenu.items[2].checked = true;
          // m.items[1].submenu.items[3].checked = true;
          // m.items[1].submenu.items[4].checked = false;
          // m.items[1].submenu.items[5].checked = false;
          mainWindow.window.webContents.send('lang', 'ru');
        }
      },
      // {
      //   label: 'Turkish', type: 'checkbox', checked: false, click() {
      //     m.items[1].submenu.items[0].checked = false;
      //     m.items[1].submenu.items[1].checked = false;
      //     m.items[1].submenu.items[2].checked = false;
      //     m.items[1].submenu.items[3].checked = false;
      //     m.items[1].submenu.items[4].checked = false;
      //     m.items[1].submenu.items[5].checked = true;
      //     mainWindow.window.webContents.send('lang', 'tu');
      //   }
      // },
    ]
  }
  ])
  Menu.setApplicationMenu(m)
})

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow.window === null) {
    mainWindow.createWindow();
  }
});
