const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig() {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'sentinel-win32-x64/'),
    authors: 'Sentinel',
    version: "0.0.2",
    noMsi: true,
    name: "sentinel",
    description: "Sentinel",
    title: "Sentinel-alpha-0.0.2",
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'sentinel.exe',
    loadingGif: path.join(rootPath, 'public', 'loading.gif'),
    setupExe: 'Sentinel-alpha-0.0.2-win-x64.exe',
    setupIcon: path.join(rootPath, 'public', 'icon256x256.ico')
  })
}
