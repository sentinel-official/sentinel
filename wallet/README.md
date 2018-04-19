Sentinel Desktop Client - Installation Guide
===

Download the installer from the Sentinel official [GitHub Repo](https://github.com/sentinel-official/sentinel/releases) or [Website](https://sentinelgroup.io) for respective platform and follow the below instructions.

*We're Enabling Developer Console In This Version For Better Error And Log Reporting. Please Use It When Submitting Issues In The Chat Group or on Our Github Repo*

```Please Enable Testnet From Topbar Before Using The Sentinel App```

Linux
---

If you are on Ubuntu, tnstall the deb file with the Ubuntu Software Center or by running the command

```
sudo dpkg -i Sentinel***.deb
```

In case of any issues/errors regarding dependencies then run below command and after running the above command.

```
sudo apt-install -f
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

- In This Version You Can Launch The App Without Administrator Access.

- Run the Sentinel***.exe file, You'll See The Sentinel Logo and after a little wait, the app will open.

- And from second time, you can run the app from folder: 

    ```C:/ > Users > {Your Username} > AppData > Local > Sentinel > Sentinel.exe```
    
- Additionally, You Can Create A Shortcut of the App And Save it On Your Desktop For Ease Of Use. For That Right Click On the sentinel.exe file and click ```Create Shortcut```. After That You Can Copy That Shortcut To Your Desktop And Open The App From Desktop Everytime.

- If You're Facing Any Issues like ***OpenVPN Is Not Installed*** or ***Something Went Wrong***, Please Uninstall Your Already Installed OpenVPN from control panel and then re-install OpenVPN from the following path on Your Local Machine And Re-Run The Sentinel App.
```C:// > Users > {Your Username} > AppData > Local > Sentinel > app-0.0.32 > resources > extras > openvpn-install-2.3.18-*.exe```
