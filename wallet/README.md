Sentinel Desktop Client - Installation Guide
===

Download the installer from the Sentinel official [GitHub Repo](https://github.com/sentinel-official/sentinel/releases) or [Website](https://sentinelgroup.io) for respective platform and follow the below instructions.

*We're enabling developer console in this version for better error and log reporting. Please use it when submitting issues in the chat group or on our github repo*

```Please enable testnet from topbar for using the Sentinel dVPN```

Linux
---

If you are on Ubuntu, install the deb file with the Ubuntu Software Center or by running the command

```
sudo dpkg -i Sentinel***.deb
```

In case of any issues/errors regarding dependencies then run below command and after running the above command.

```
sudo apt install -f
```

A prompt will open everytime you try to run app. This prompt is to have super user (sudo) privileges for application. Please enter your system password and continue.

Mac
---

- Run the .dmg file and drag the Sentinel app to ***Applications*** folder.

- Go to Applications Folder and right click on sentinel app and Click on ***Show Package Contents*** option.

- Then go to ```Contents > MacOs```  and run sentinel by double clicking the package.

- Additionally You can create a shortcut of the app by right clicking the sentinel package and click ```make alias```, then copy the alias to your desktop for ease of use.

- While connecting to VPN, in case of the erorr - 'Package ***brew*** is not installed' error. Then please install homebrew in your system and then try connecting to the vpn.

- Please follow instructions from this [howtogeek tutorial](https://www.howtogeek.com/211541/homebrew-for-os-x-easily-installs-desktop-apps-and-terminal-utilities/) to install Homebrew

Windows
---

- In this version you can launch the app without ```Run As Administrator```, anyhow a prompt will be shown to give admin access.

- Run the Sentinel***.exe file, You'll See The Sentinel Logo and after a little wait, the app will open.

- And from second time, you can run the app from folder: 

    ```C:/ > Users > {Your Username} > AppData > Local > Sentinel > Sentinel.exe```
    
- Additionally, you can create a shortcut of the app and save it on your desktop for ease of use. For that right click on the sentinel.exe file and click ```Create Shortcut```. After that you can copy that shortcut to your desktop and open the app from desktop everytime.

- If you're facing any issues like ***OpenVPN Is Not Installed*** or ***Something Went Wrong***, please uninstall your already installed OpenVPN from control panel and then re-install OpenVPN from the following path on your local machine and re-run the Sentinel App.

```C:// > Users > {Your Username} > AppData > Local > Sentinel > app-0.0.32 > resources > extras > openvpn-install-2.3.18-*.exe```


**Version 0.0.4 alpha:**

**Linux:**

If you are using ubuntu version less than or equal to 16.04, then please run following command:
```
sudo add-apt-repository ppa:max-c-lv/shadowsocks-libev -y
sudo apt-get update
```
Install the deb file with the Ubuntu Software Center or by running the command

```
sudo dpkg -i Sentinel***.deb
```

In case of any issues/errors regarding dependencies then run below command and after running the above command.

```
sudo apt install -f
```

A prompt will open everytime you try to run app. This prompt is to have super user (sudo) privileges for application. Please enter your system password and continue.

To check socks list or to connect any socks node, then please enable testnet toggle and socks toggle which are on top right corner.
After you can check socks nodes in vpn-list tab.

After connecting to socks node, to use internet please restart your browser. You need to do for each time when you tried to connect.
