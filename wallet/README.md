Sentinel Desktop Client - Installation Guide
===

Download the installer from the Sentinel official [GitHub Repo](https://github.com/sentinel-official/sentinel/releases) or [Website](https://sentinelgroup.io) for respective platform and follow the below instructions.

Linux
---

If you are on Ubuntu, install the deb file with the Ubuntu Software Center or by running the command.

```
sudo apt-get install openvpn
```



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

- If there's no OpenVPN and the client pops a message asking for a manual install, use [this URL](https://openvpn.net/index.php/access-server/docs/admin-guides/183-how-to-connect-to-access-server-from-a-mac.html)

- If OpenVPN is installed and the client throws up the an error, try this command: 

```
export PATH=$(brew --prefix openvpn)/sbin:$PATH
````

And also install 'pidof' before running app by using:

````
brew install pidof
````

- If brew is not installed, please follow [this URL](https://www.howtogeek.com/211541/homebrew-for-os-x-easily-installs-desktop-apps-and-terminal-utilities/) for a step by step process.

- If you have errors regarding the installation of cask, please use the below command:

````
brew install cask
````
- To know more about the Tunnelblick configuration, follow this [URL](https://tunnelblick.net/cFileLocations.html)


Windows
---

- OpenVPN installer can be located here in the middle of the page for windows version : https://openvpn.net/index.php/open-source/downloads.html
  Download and install, you should reboot your computer when it's completely installed, this will ensure proper vpn connections. 

- It is recommended that you exclude windows defender scanning for the sentinel wallet 
- Run the Sentinel***.exe file with Run As Administrator option and a loading gif will be running and after a few min, you will have the app opened.


- Please wait for sometime until the loading gif closes. App also will close once and will open again

Note : - You can run the app from this folder(or move it where you desire): C://Users/{yourUser}/AppData/sentinel/sentinel.exe (versions may have appended naming convention). Don't forget to right click and run app with the *'Run as Administrator'* option.
