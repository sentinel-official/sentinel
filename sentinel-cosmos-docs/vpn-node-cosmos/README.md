OpenVPN Node Setup on TM
===

1. Navigate to the User's home directory

    `cd $HOME`

2. Create a folder for storing config and key files

    `mkdir -p $HOME/.sentinel`

3. Get the sample config file:

    `curl https://raw.githubusercontent.com/sentinel-official/sentinel/master/vpn-node-cosmos/config -o $HOME/.sentinel/config`

    ![](https://i.imgur.com/fsaUtQO.png)
    
4. Navigate to ```.sentinel``` folder

    `cd $HOME/.sentinel/`

5. Open the config file by running the below command

    `gedit config`

    ![](https://i.imgur.com/HwCqxRc.png)

6. Configure the config file and save it.

    Edit only the below fields:

    - ```api_port``` [For Ex:  5000]
    - ```description```  [Used when users search for nodes in upcoming versions]
    - ```openvpn->enc_method``` [Indicates the encoding method utilized to encrypt data]
    - ```openvpn->port``` [For Ex : 1184]
    - ```openvpn->price_per_gb``` [For Ex : 56, which means, 56 TSENT per GB]

    **Note: Do NOT use these ports 1195, 1317 and 27017**

    If you already have Sentinel **keys** folder, kindly copy to the directory $HOME/.sentinel.

    For example, in the below image we have edited the config file by adding ```description``` and changing ```api_port```, ```openvpn->port``` and ```openvpn->price_per_gb```.

    ![](https://i.imgur.com/39CHrLC.png)

7. Pull and run the official Sentinel Network docker image from Docker Hub

    `sudo docker run -it --privileged --mount         type=bind,source=$HOME/.sentinel,target=/root/.sentinel -p {API_PORT}:{API_PORT} -p {OPENVPN_PORT}:{OPENVPN_PORT}/udp sentinelofficial/stt1-dvpn-openvpn`

    **Note:** Replace the API_PORT in the above command with API port number in the config file and replace the OPENVPN_PORT with the openVPN port number in the config file.
    
    For example, if your API port is 5000 and OpenVPN port is 1184 then the command will be: 
    
    ```sudo docker run -it --privileged --mount         type=bind,source=$HOME/.sentinel,target=/root/.sentinel -p 5000:5000 -p 1184:1184/udp sentinelofficial/stt1-dvpn-openvpn```
    
    Kindly refer the below image:
    
    ![](https://i.imgur.com/M4i5mbG.png)

8. After the image is pulled, wait for few seconds. The application will ask for account name and password. Kindly provide them. These will be used for making the session transactions and payments. **Don't forget them.**


    ![](https://i.imgur.com/B86UNEh.png)
    
9. After you enter the account name and password, it creates the Keys folder in the.sentinel directory and the dVPN node starts running.
   
    ![](https://i.imgur.com/3MhqfUC.png)
       
10. To stop the node and the container, press "ctrl + C" or run the below command

    `sudo docker stop {Container ID}` 
    
    ![](https://i.imgur.com/2Q54mmm.png)
    
11. To start the node **again**, first you need to know the container ID. To know the container ID, run the below command. 
     
     `sudo docker ps -a`
    
    ![](https://i.imgur.com/Clin9Ao.png)
    
12. Copy the container ID and replace the CONTAINER ID in the command below with the copied ID. Press enter to start the node. And enter the same account name and password that you created at first place.

    `sudo docker start -i {CONTAINER ID}`    
    
    ![](https://i.imgur.com/55A0M0W.png)


    
OpenVPN Node Updation on TM
===

1. Stop the running docker container

    `sudo docker stop $(sudo docker ps -aq -f   ancestor=sentinelofficial/stt1-dvpn-openvpn)`

2. Remove the older version of docker container

    `sudo docker rm -f $(sudo docker ps -aq -f ancestor=sentinelofficial/stt1-dvpn-openvpn)`

3. Remove the older version of docker image

    `sudo docker rmi -f $(sudo docker images -aq -f reference=sentinelofficial/stt1-dvpn-openvpn)`

4. After these commands, follow from step **7** to the step **9** of **OpenVPN node setup on Tendermint**.


Helpful docker commands to interact with the Sentinel dVPN Node
===

*  list a running Sentinel dVPN Node: 

    ```sudo docker ps```

* list both, running and stopped Sentinel dVPN Nodes:

    ```sudo docker ps -a```
    
* stop a particular Sentinel Node:

    * run ```sudo docker ps``` and copy the Container ID.
    * run ```sudo docker stop ContainerID```
 
     ###### Note: stopping a dVPN Node does not remove the container
 
* remove a particular Sentinel dVPN Node:
    ```sudo docker rm ContainerID```

    ###### Note: The Sentinel dVPN Node must be stopped to be removed. Alternatively, you can use the `-f` flag to forcefully remove the Node if the node can not be stopped.

* remove all stopped Sentinel dVPN Nodes:

    ```sudo docker rm $(sudo docker ps -a -q)```
    
* stop all the running dVPN Nodes and remove them:
    ```sudo docker stop $(sudo docker ps -a -q) && sudo docker rm $(sudo docker ps -a -q)```         
