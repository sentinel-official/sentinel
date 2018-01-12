const url = require('url');
const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;
var i18n = new (require('./translations/i18n'))

function windowManager() {
  this.window = null;

  this.createWindow = () => {
    this.window = new BrowserWindow({ title: "My App", resizable: false, width: 480, height: 672 });
    this.window.loadURL(url.format({
      pathname: path.join(__dirname, 'build/index.html'),
      protocol: 'file:',
      slashes: true
    }));
    this.window.on('closed', () => {
      this.window = null;
    });
  }
}

const template = [
  {
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

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)