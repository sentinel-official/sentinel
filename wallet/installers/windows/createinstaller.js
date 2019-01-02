const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const appVersion='0.0.43'

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
    version: appVersion,
    noMsi: true,
    name: "Sentinel",
    description: "Sentinel",
    title: "Sentinel-alpha-"+appVersion,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'Sentinel.exe',
    loadingGif: path.join(rootPath, 'public', 'icon256x256.png'),
    setupExe: 'Sentinel-alpha-'+appVersion+'-win-x64.exe',
    setupIcon: path.join(rootPath, 'public', 'icon256x256.ico')
  })
}
