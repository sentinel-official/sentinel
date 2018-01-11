const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'sentinel-wallet-app-win32-x64/'),
    authors: 'Sentinel',
    version: "1.0.0",
    noMsi: true,
    name: "sentinelwallet",
    description: "Sentinel Wallet Desktop App",
    title: "Sentinel Wallet Desktop App",
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'sentinel-wallet-app.exe',
    setupExe: 'SentinelWalletAppInstaller.exe',
    setupIcon: path.join(rootPath, 'public', 'icon256x256.ico')
  })
}
