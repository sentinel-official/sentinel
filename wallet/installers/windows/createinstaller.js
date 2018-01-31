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
    appDirectory: path.join(outPath, 'sentinel-wallet-win32-x64/'),
    authors: 'Sentinel',
    version: "0.0.2",
    noMsi: true,
    name: "sentinel",
    description: "Sentinel Wallet",
    title: "Sentinel Wallet",
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'sentinel-wallet.exe',
    setupExe: 'SentinelWalletInstaller.exe',
    setupIcon: path.join(rootPath, 'public', 'icon256x256.ico')
  })
}
