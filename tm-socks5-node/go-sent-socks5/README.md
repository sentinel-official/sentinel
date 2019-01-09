# A CLI-Tool written in golang using cobra, To Run a Sentinel SOCKS5 Node

Download the binaries and config.toml from the bin directory or from the links below . 
Go to the directory, where you downloaded these files and run these commands to do the initial setup

[sentinel-socks5](https://github.com/sentinel-official/sentinel/raw/sentinel-socks-node/go-sent-socks5/bin/sentinel-socks5)
[config-server](https://github.com/sentinel-official/sentinel/raw/sentinel-socks-node/go-sent-socks5/bin/config-server)
[config.toml](https://github.com/sentinel-official/sentinel/raw/sentinel-socks-node/go-sent-socks5/bin/config.toml)


    chmod +x sentinel-socks5
    chmod +x config-server
    sudo mv sentinel-socks5 config-server config.toml /usr/local/bin


* If it's the first time you are running a Sentinel SOCKS5 node, most probably you will be missing dependencies, please run the following command to install dependencies as sudo
    ```
    $ sudo sentinel-socks5 install-dep
    ```
>Note: You only need to run the above command once, and this is the only command that needs sudo access.
when a success message is returned in the terminal, please follow next instructions

* A wallet address is must to run this node with a couple another parameters. To get a wallet address (in case you don't alread have one), run the following command

    ```
    $ sentinel-socks5 get-wallet -p <Your Password>
    ```
it will create a file named ***KEYSTORE*** which will have your ethereum keystore. This keystore will be used to register your node a sentinel master node and this keystore will receive all the rewards that you node will earn by sharing bandwidth

* Now that you have a wallet address, you can register you node with a sentinel master node by using following command

    ```
    $ sentinel-socks5 run -p <price per gb> -w <wallet address> -k <shadowsocks node password>
    ```

this should register your node with a ***SENTINEL MASTER NODE*** . A success message will be displayed in the terminal. Plus it will open a port and start a config-server which is used for making the node health checks and serving SOCKS5 configs to the client.

* To kill the node just run

    ```
    $ sentinel-socks5 kill
    ```