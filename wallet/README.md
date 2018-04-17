Sentinel Desktop Client - Installation Guide
===

Download the installer from the Sentinel official [GitHub Repo](https://github.com/sentinel-official/sentinel/releases) or [Website](https://sentinelgroup.io) for respective platform and follow the below instructions.

Linux
---

If you are on Ubuntu, install the deb file with the Ubuntu Software Center or by running the command.

```
sudo dpkg -i Sentinel***.deb
```

In case of any issues/errors regarding dependencies then run below command and then after run the above command.

```
sudo apt-install -f
```

A prompt will open everytime you try to run app. This prompt is to have super user (sudo) privileges for application. Please enter your system password and continue.

Mac
---

- Run the .dmg file and drag the Sentinel app to ***Applications*** folder.

- Go to Applications Folder and right click on sentinel app and Click on *'Show Package Contents'* option.

- Then go to Contents > MacOs > Sentinel and run Sentinel.

- While connecting to VPN, in case of the error - 'Package ***brew*** is not installed' error. Then please install homebrew in your system and then try connecting to the vpn.

- If there's no OpenVPN and the client pops a message asking for a manual install, use [this URL](https://support.prolianteasyconnect.com/hc/en-us/articles/208045615-How-to-install-Management-OpenVPN-client-Mac-OS-X)

- If OpenVPN is installed and the client throws up the an error, try this command: 

- To know more about the Tunnelblick configuration, follow this [URL](https://tunnelblick.net/cFileLocations.html#configuration-files)

```
export PATH=$(brew --prefix openvpn)/sbin:$PATH
````

And also install 'pidof' before running app by using:

````
brew install pidof
````

- If brew is not installed, please follow [this URL](https://www.howtogeek.com/211541/homebrew-for-os-x-easily-installs-desktop-apps-and-terminal-utilities/) for a step by step process.

Windows
---

- Run the Sentinel***.exe file with Run As Administrator option and a loading gif will be running and after a few min, you will have the app opened.

- Please wait for sometime until the loading gif closes. App also will close once and will open again

- And from second time, you can run the app from folder: C://Users/{yourUser}/AppData/sentinel/sentinel.exe. Don't forget to right click and run app with the *'Run as Administrator'* option.
