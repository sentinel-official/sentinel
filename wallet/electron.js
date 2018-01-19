const url = require('url');
const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;
var i18n = new (require('./translations/i18n'))

function windowManager() {
  this.window = null;

  this.createWindow = () => {
    this.window = new BrowserWindow({ title: "My App", resizable: false, width: 1000, height: 672, icon: './public/icon256x256.png' });
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
app.on('ready', function() {
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
        
    ]},
    { label: i18n.__('View'), submenu: [
      
      {
        role: 'toggledevtools', label: i18n.__('Toggle Developer Tools')
      }
    ]
  }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(templates))
})
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