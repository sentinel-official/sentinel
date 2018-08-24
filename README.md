# Sentinel - Lite Paper
===

### Create Public & Private Networks and participate in a Marketplace of distributed Resources powered by dApps

_____________________
![Sentinel Security Group](https://raw.githubusercontent.com/sentinel-official/sentinel/master/docs/Sentinel%20Security%20Group_LitePaper%20v10%20001.jpg)
_____________________

Sentinel Service Chain
===

### The Networking Layer for Distributed Services

Motivation
--

The first step in executing the vision was to create a strong bandwidth incentivization and resource monitoring protocol. In order to work towards  completing this foundation step Sentinel has launched a prototype of a VPN client with the intention to facilitate the monitoring, and incentivization of data between a host node and an end user.

Based on interoperable blockchain technology, Sentinel Network aims to utilize multiple blockchains to provide the following services. 

Features of the Sentinel Network
---

- **Distributed, no node stores complete data**

    - Data retention on the network is minimal as it is incomplete. Whatever each node owns is hashed and viewable only by the owner.
 
    - User identification data is stored on a separate chain. (AUID) This is discussed further down in the paper. 
    
    - BFT based consensus using the TenderMint Consensus Engine; capability to work even with greater than 2/3<sup>rd</sup> of the nodes failing

    - Any attacks on the network will trigger auto-scaling and network re-location, isolation of affected nodes.

- **Developer friendly SDK**

    - Quick testing and implementation as physical resources are provided by service nodes unlike very expensive, resource-intensive central servers.

    - Easy to access end-use. Services/Apps can be traded on the market.

- **Uses a single desktop/mobile client to connect to all services.**

    - Currently uses a single point of access to streamline services.

    -  This might be separated in the future. 

    - Users can be incentivized if they become *Service Provider* nodes and maintain a good reputation
    - AUID (Anonymous user identification) which is discussed further on in this paper, employs a reputation based incentivization.
  
  - dVPN is the first implementation of Native Services an 

    - Developers can implement the Sentinel SDK in their own applications.

    - Can sell and trade applications and resources on the Sentinel Services Marketplace.
    
Architecture of Sentinel
===
 
*Sentinel* employs what is called a multi-chain architecture and is resourceful to secure data exchange between ***people*** and ***applications*** - Legacy, Enterprise Apps, Mobile Apps and dApps (meaning, the ability to handle centralized and decentralized applications is native to the protocol). The network solves problems with infrastructure and scaling, thereby achieving production level speed of transaction by implementing:

**Multi-Chain Architecture**

- **Identity Chain** - An Anonymous User ID (AUID) is created and stored in an independent chain which interacts with the other chains to provide access to Services on the Service Chain and for payment processing on the Transaction Chain.

- **Service Chain** - Secure Tunneling of Data with a Underlay and an Overlay Relay Network. Governance will be implemented on top of the Service Chain and a peg Token, called *Sentinel Service Token* ($SENT-SST) will be the Utility token used for Transactions in the Service Chain.

- Payments and related processing of sending transactions to the *Sentinel Transaction Pool* and so on is handled by the **Sentinel Transactions Chain**. 

Identity Chain & Anonymous User ID (AUID)
===

- AUID will be the single source of access for all *Services* on the Sentinel Network

- The network will be governed by Reputation. Higher the reputation,easier the access to Services and Master Nodes.

- The network has monetary incentivization for good behaviour where, higher reputation will mean higher the potential to earn.

- AUID doesn't store any information unless needed and provided by the Users themselves.

- Solves the problem of a single point of failure by distributing the AUID ledger across the Sentinel Node Network

- Bad actors risk reduction in Reputation if they engage in spamming or malicious activity

- The distributed consensus mechanism of the network quickly and effectively recognizes compromised ID’s. Auto mitigation solutions will kick in to make the network isn’t affected

- Efficient Application specific identity management

Sentinel Service Chain
=

Sentinel Security Suite
-

The Sentinel Security Suite is a set of products that are developed by the Sentinel community and core team and functions utilizing protocols and Sentinel Network SDK.


Secure Access - dVPN
-

A decentralized Virtual private network powered by blockchain technology. The dVPN (decentralized Virtual Private Network) is the first use case built on the blockchain with an extremely distributed network topology with nodes spanning across continents. Each node can either be a desktop/laptop computer, mobile phone or even a server on the cloud. A ledger of packet/ data transactions are stored on the blockchain with a ‘Proof of Traffic’ consensus system, which incentivizes users primarily for the bandwidth served and monetizes any unused bandwidth that they may declare on the Sentinel Network.

A working version of the Sentinel Desktop Client (currently in alpha) can be found on the [releases](https://github.com/sentinel-official/sentinel/releases) page of the GitHub profile.

NOTE : This version is only a proof of concept and is meant only for Testing the functionality of the dVPN and the resource incentivization protocol (with dynamic node pricing). Use it at your own risk and liability of traffic at the exit node is also upon the host.

We are working towards a fully functional dVPN that we can use everyday to send all of our home traffic through it, but the time is not now.

In case of any issues with the current Sentinel Desktop Client, do let us know by filing an [issue](https://github.com/sentinel-official/sentinel/issues) on the GitHub Repo or by starting a conversation with the bot and submitting an Issue directly to the bot - [Sentinel Support Bot](https://t.me/SentinelSupportBot)

**Roadmap for the dVPN**


In addition to the dVPN, Sentinel also plans to work on an image & firmware that’s required to set it up in a box which takes in Ethernet as the input and connects to the router at home/office. This way, all traffic that passes through the router goes through the VPN. This box also helps efficient monetization of network bandwidth as this box consumes a fraction of the power consumed by a PC. 


Secure Communication - Sentrix
-

Sentrix is Sentinels answer to the growing privacy concerns around centralized trust based communication services that store sensitive user information. Facebook, WhatsApp, Google etc fall under this category. 

Sentrix is a secure Communication Suite running on top of the Sentinel Service Chain, utilizing the power of decentralized, peer-to-peer network, developed using proven communication protocols like Matrix Communication Protocol (References 1,2)

What does Sentrix comprise of?

- dChat
- dVoIP

Sentrix will operate without a DNS and thereby is completely decentralized, operating only in a peer-to-peer fashion with utmost security using Ratchet Algorithms like OLM and MegOLM & more.

The lifetime of a message on Sentrix is finite. Thereafter, all messages exceeding that finite limit, will be removed from the servers throughout the network. A backup option will be provided as part of the Desktop/Mobile Client, where messages will be encrypted and saved locally. This finite time might initially be decided by the network. Later on, users will have an option to define the same themselves

Implementation of Services on the Service Chain
---

There are two types of services on the Sentinel Network. 

1. Native Services
2. External / Third Party Distributed Services (centralized and decentralized)

Native Services are developed by the Sentinel Community and will be working towards the successful implementation of the same.

End-to-End encryption with BFT based consensus
--

One common issue that is raised in privacy and specially, VPN projects or distributed anonymous network projects is the possible presence of bad actors or malicious nodes. While traffic is encrypted between the entry node and exit node and is passed on through various methods of closed tunneling, there is always the question of what if the exit node is malicious and can pick up other networking variables from the User session which could help the malicious actor generate a user fingerprint.

Currently, this issue is addressed by networks like TOR and i2p where there’s a relay of packets and utilizes packet routing techniques to ensure identity of the source and destination is not revealed.

Sentinel is developing a relay network, where participants in the network can choose to be a relay or an exit node on which encrypted tunnels traffic between the VPN paid user and an exit node.

A consensus mechanism coupled with hybrid packet routing
---

Sentinel will be building a relay network involving the use of governance nodes which will dictate path of packet transmission between user and exit node.

It does this by analyzing different input factors to determine best relay path such as:

- Number of hops requested by user
- Reputation and latency of relays
- Packet Standardization requests
- Ability to choose
- Direct tunneling, relay

Anonymous Mixer
---

When a user wishes to use the Sentinel dVPN or another service, the user would have to conduct a ‘Service Swap’ by sending SENT to the swap wallet. This event will trigger an ETH smart contract that would issue the user tokens on the ‘Service Chain’ to their predefined addresses. 

For Example:


- User A establishes relation between their Chain #2 address to the SENT wallet. USER A sends 50 $SENTs to Sentinel Swap Node.
- The Sentinel Swap Node will receive Chain#2 address input from the wallet of USER A and will trigger an output to Chain #2 Blockchain’s API
- This will now  will result in a transaction from Chain #2 Swap Node to User’s Chain #2 Wallet in a ratio of 1:1 between $SENT and $SST
- USER A then utilizes a service, like the dVPN, and sends 5 $SST to Provider B. 
- Provider B wishes to cash out 50 $SST into $SENTs and sends the same to Swap Address on the ‘Sentinel Service Chain’ 
- This triggers a smart contract that will result in Provider B receiving 50 $SENTs into their predefined Sentinel Transaction Chain Wallet.

Governance on the Service Chain: Resource Incentivization Protocol
----

The model of offering services and billing per transaction itself generates the need for increased and efficient Governing mechanisms. Below mentioned are the types of blocks that are utilized during service delivery in the Sentinel Network

#1 Service Block
-
This are the root blocks from which service registration blocks are generated. These are sentinel node created blocks. 


#2 Service Registration Block (created by Consumers)
-
Once a consumer requests a service through the wallet, a service registration block is generated by the consumer.


#3 Service Moderation Block (created by Service Providers)
-

Once demand is generated by the the service registration block, the service provider generates moderation block which essentially keeps record of the services facilitated by the service provided and the incentivisation records.

#4 Individual (if centralized)
-
If a single entity or enterprise hosts the service, the Service and the Node both run as per the terms and conditions of the Service Provider. For services such as this, the moderation is entirely controlled by the Individual Entity and based on the approval, an Authorization Block is created, that’s by default in the Unapproved State until Consumer/User consent.

#5 Miner/Node/Provider Pool (if decentralized)
-

If a service is decentralized in nature and has to run through a miner/node pool for governance purposes, these blocks are created and post approval, there’s an Authorization Block that’s created which is by default in the Unapproved State until Consumer/User consent.


#6 Authorization Block (Unapproved State)
-
This is the block that’s created for the Consumer/User to approve the start of a service. Authorizing or approving will mean that the service can start billing for utilized services.

#7 Start Block
-
Once a Consumer/User approves the start of billing of a service, this block is created indicating the same. This block is the primary reference for the chain indicating the state of a service in relation with a Consumer/User.

#8 Stop Block
-
Once a Consumer/User cancels the billing of a service, this block is created indicating the same. This block is the primary reference for the chain indicating the state of a service in relation with a Consumer/User. A stop block can not be created in case of an existing Unpaid block.

#9 Service Block
-
Each transaction on the Service Chain involves exchange of assets - resources for monetary value. This transaction in essence comprises the Network and every service block in the Service Chain captures this information. Each service will have different data being captured and the team is working on a way to package them all on the chain that’s being developed using TenderMint.

#10 Paid
-
This block is created after a Consumer/User initiates and completes the transaction to a Service Provider. For Pre-Paid models, a paid block is first created before an unpaid block.

#11 Unpaid
-
This block is created after a Service is utilized or in pre-paid form of Governance, it is created before a Consumer/User starts using the service. In a post-paid form of Governance, it is created after the utilization of a service.

If there’s an unpaid block on the Service Chain for a specific Consumer/User, suspension of the same will not be possible and the Consumer/User will lose coins staked to use the service and also lose reputation.

#12 Hold
-

This block is created, when a User sends a Payment to a Service Provider. The payment, if first sent to the Sentinel Transaction Pool of current payments and is processed there to be sent to the Service Provider at a later point in time.

#13 Dispute
-
This block is created when a Consumer/User has an issue with a Service Provider. Communication between the Service Provider and the User is key and hence, these will be part of the Service Chain upon the launch of the Secure Communication Suite.

The provision for these to happen is being accommodated into the desktop and native clients. During a dispute, each of the  parties will resolve it among themselves and whoever raised the request will have to mark the issue as Resolved

During a dispute, suspension of a Service will not be possible, i.e. a Stop block will not be generated.

#14 Resolved
-
These blocks are created once an issue, previously in the Dispute state has been marked Resolved by the issuer.

#15 Micro Transactions
-

Each transaction goes through the Transaction Pool and is then distributed to the receiver, both peer-to-peer and to the Service Provider.

Transactions are sent to the pool based user-defined smart contracts and [*State Channels*](https://medium.com/l4-media/generalized-state-channels-on-ethereum-de0357f5fb44) are used to create sessions between:

- *sender* (*User* wallet or *Service Provider* wallet) to *Transactions Pool*
AND  
- from the *Transactions Pool* to the *receiver* (*User* wallet (OR) *Service Provider* wallet) 


Sentinel Transactions Chain
===

- The Sentinel Transactions Chain enables users to securely pay for services  using their AUID and related wallets.
- Transactions on this chain are backed by Solidity based smart contracts on the Ethereum Chain. These transactions are validated by miners on the Ethereum Network.
- Master Nodes will have the ability to run nodes to validate and secure the network.

The Road Ahead
===

What features does Sentinel currently have?
---

Sentinel's first implementation on the Service Chain is a very secure decentralized VPN service. This VPN is based on a peer to peer technology. This means that the network runs because of people's support instead of a central server. Centralized servers can be monitored by a Government and can be brought down by hackers.

Sentinel's dVPN service allows a person to use the VPN service or help the VPN by sharing free, unused internet with other people in the network. This is done in a very secure way with technologies that are very new to the industry.

The person who is sharing his internet with other people is called a *Node*. The *node* can choose the price of the internet he shares. This is done by our crypto-currency which is called Sentinel Token, represented by $SENT. Eg; The *node* who shares his internet to others may charge the users in $SENTs per Gigabyte of internet shared or simply, $SENTs/GB.

At the moment there are over 20 such *node*'s who share secure internet in our network and this number is growing every day. Hordes of people are testing our VPN service and reporting very good results. 

Our network lives on the Ethereum Rinkeby Testnet at the moment until we launch our final product.

Our VPN technology is very special and unique because this is the first time blockchain technology is being used for Internet security. Our pricing system (Sents/GB), is the first time a blockchain is being used this way. All communication in a blockchain network takes place via a method called "Smart Contracts". Sentinel's smart contracts to measure internet usage and sharing are very accurate. Such an implementation of smart contracts to charge users the exact amount for their internet usage has never been done before using blockchain technology. 

Users who use the secure internet and users who share secure internet both are measured very carefully. If any user, doesn't pay after using secure internet from a node, his account will be blocked or banned.

What features does Sentinel plan to have in the future?
--

In the future, Sentinel will provide the following features to the network:

1) Packet Standardization across the Sentinel Network
    - Packet standardization makes it harder for hackers or legal entities to find your data among all the data in the internet.

2) Anonymous Mixer
    - This feature will mix user identification so that no one will know your identity while browsing.

3) Resource Incentivization Protocol to incentivize Bandwidth, Storage and Computing
    - In the future, people will be able to share more than just secure internet on the Sentinel network. Eg; In the future, you will be able to share spare storage, spare CPU power. You can charge for sharing the spare storage or compute power in SENTS.
   
4) Decentralized Chat/Messaging System (dChat)
    - We have already begun testing our messaging platform based on blockchain technology. It is very safe, secure and fast. 
  
5) Decentralized VoIP/Calling (dVoIP) 
    - In the future, users will be able to make voice calls on our distributed network
    
6) Hardware Boxes for Secure Access to multiple devices
    - We have begun testing a hardware box which we can connect to a router. This will allow any device connected to the router to use secure internet and other services on our network. 

How does a user benefit from Sentinel's features?
-

Privacy today is under attack. We cannot fully be secure from the government and hackers using normal tools available today. Sentinel uses the power of blockchain technology to give you tools that work indubitably in protecting your privacy on the internet. It has various privacy services on the network that have been developed keeping your privacy and safety in mind.

Some of these useful features are:
* AUID (Anonymous User Identification)
    * In our network, we give each user a special user ID. One user cannot have more than one of these ID's. The user can then access all services on our network using this ID. No user data is ever stored or recorded. 

* A Free Internet 
    * Users can browse many websites which are usually blocked in some countries. Eg; If you go on a business trip to China and you want to check your company website. (Most company websites are blocked in China).

* Many services from many people in our services market
    * In the future, our network will have an open market for services. Developers can share, sell their services here and users can access them.

How can a user host a node or be a part of the network?
-

Users can host nodes by following instructions here - https://github.com/sentinel-official/sentinel/blob/master/vpn-node-docker/README.md

or follow the below commands if they are on any linux system with `curl`, `Docker` & `OpenVPN` already installed.

**Step #1**

Go to the `root` folder of a user with the below command.

`cd ~`

**Step #2**

Create a directory in the folder

`mkdir -p $HOME/.sentinel`

**Step #3**

Run docker, get and run Sentinel

`sudo docker run -it --privileged --mount type=bind, source=$HOME/.sentinel, target=/root/.sentinel -p 3000:3000 -p 1194:1194/udp sentinelofficial/sentinel-vpn-node`

If you face any issues, please ping us on [Telegram](https://t.me/SentinelSecurityGroup) or please post an issue on the [GitHub repository](https://github.com/sentinel-official/sentinel/blob/master/vpn-node-docker/README.md) directly

How is Sentinel different from Substratum, Mysterium, Privatix and other VPN competitors?
-

Sentinel is very different from Mysterium, Privatix etc. You can use VPN services on Sentinel and you can also use many useful service such as dChat, dVOIP, dDNS, etc. These services are all available in Sentinel's Network layer. We will realease a software development kit for developers very soon so that other people can also make useful services for our network. We can use Sentinel dVPN with these services to make sure the service is fully secure and anonymous.

Sentinel's team of developers are working hard on bringing the software development kit to you. We are currently using this development kit to bring bring these services to you:

1) Decentralized Chat (dChat)
    - To chat with your friends without keeping any logs. Eg; China and Syria has passed laws to keep records of chats and identities too

2) Decentralized Voice over Internet Protocol (dVoIP)
    - Just like Skype, but safer. 

3) Decentralized File Sharing System (dFiles)
    - Secure storage that will never fail

Our chat, VOIP and Storage services are really valuable. We will bring these services to you in a package called the "Sentinel Secure Services Suite". We plan to release this by the end of the year. We will also release our software development kit at this time.

These distributed services can focus on privacy first or encrypted data transfer first. It will take the SaaS route of offering VPN for a fixed price.

We have a long-term vision of providing the most secure VPN service apart from offering the services described above at enterprise level soltions. In the future, both people and companies will use dAPPs and services that live on the Sentinel network.  

In our time-line, we promised that we would make a hardware device to connect to a router and share secure internet with all devices connected to this router. We are very enthusiastic about this device and we think it will change the world.

As mentioned in the roadmap, Sentinel aims to encrypt data flowing through multiple devices using a hardware box, that will take input from the internet provider and connect to a router. Hence, all data flowing through the router will be encrypted. This hardware box is a huge step in realizing what we see as the potential future.

Uses of Sentinel's Smart Contract in other Industries
-

When a user uses secure internet, it is called a "transaction". Users may agree the amount they are ready to pay for a transaction. When users use enough secure internet, eg; 1GB or 1TB, the user has to pay this amount to the Master Node in the network. The master node will take a small transaction fee and then send the remaining amount to the service provider node.

This method is very easy to implement in many industries:

The money that has been spent for this will be collected by the Master Node, with a minor transaction fee for it, which will be distributed to Master Nodes (nodes that run the Sentinel Network and related governance systems) and Service Provider Nodes (nodes that run the entire Service)

The model of metering & incentivizing system resources (like bandwidth, storage, computing) can be utilized in multiple industries:

1) Telecom - all communications using Internet Protocol or any digital protocols can be charged just for using bandwidth and storage

2)  Media - Sharing information with journalists and similar people for either whistle blowing or just additionally secure communication

3)  Corporate Communications - Sharing inforamtion with team and boards without to the knowledge of people within the organization. Pretty important for corporations that deal with a lot of sensitive data, which shouldn't be known by everyone.


Sentinel - Decentralized DNS and Content Delivery Network (dDNS and dCDN)
-

The Sentinel dDNS works to eliminate centralized resolution of a domain name's physical location to decentralize domain lookup. Sentinel aims to have nodes as gateway nodes and use DHT (distributed hash tables) on multiple nodes to do this.

Using this, there will be DHTs with locations of nodes where media and data is stored at. Each of these nodes are discovered by the User/*Requestor* and based on latency and delivery infrastructure, content is delivered from the the most optimal location.  

Using both dDNS and dCDN, the overall network is decentralized, right from lookup to resolution and delivery.

Computing in the Decentralized Cloud (dCompute)
---

Sentinel works towards enabling applications with it's APIs and eventually the Software Development Kit (SDK), that can be integrated into their apps. This way, developers can use the existing infrastructure of the Sentinel Network and start utilizing not only bandwidth, but also storage and computing as part of this network.

For example, let's say *DocStore* is a Document Storage app, that uses Sentinel to store data and documents. Users of *DocStore*, can use traditional cloud infrastructure like AWS or S3 to be specific or can use the decentralized storage & network infrastructure provided by Sentinel.

In time, the ability for apps to run models on top of this data will also be provided by the Sentinel Network. Based on the computation resources available, the hardware that's optimized for Machine Learning (ML) algorithms or Deep Learning (DL) algorithms to run, will be automatically identified & matched with the requirement.

The Road Ahead
===

Development of Sentrix
----

Website
White Paper
Development of Node Network

Integration with TenderMint and Cosmos
---

As stated by the Cosmos team, “Tendermint is software for securely and consistently replicating an application on many machines. To simply put Tendermint is a software which can be used to achieve Byzantine fault tolerance (BFT) in any distributed computing platforms.”

Keeping the above and a host of other factors like Cosmos Swap Zones, the interoperability with Cosmos Hubs, etc. in perspective, the Sentinel team has picked up TenderMint to implement the first version (alpha) of the Sentinel Service Chain and continue research and contribute back to the community.

Roadmap of Features
-

- ERC20 Swap between multiple tokens
- Sentrix - dChat & dVoIP
- Sentinel ERC20 Mixer 


How is Sentinel's Development team?
-

Sentinel development team consists of a strong marketing, front-end and back-end development teams. Sentinel does not hire any remote back-end developers and currently all of the developers are working out of one location. 

The team has over 25 individuals composing of full-stack developers, system architects, UI/UX engineers, hardware engineers, legal due-diligence etc. There are already over 450 commits to the Sentinel code in one quarter. This puts Sentinel in the top 25 projects that are committed on GitHub.

What's interesting we are working on?
===

A lot actually.

Website
-

There will be a new version of the website with complete project information, token details, exchanges listed, partnerships, enterprises and projects Sentinel has collaborated with and of course, the roadmap. Also, we have an exciting new domain and we will be migrating away from SentinelGroup.io eventually.

White Paper
-

Owing the busy research and product development schedule (and the infinite iterations that are an output of a similar number of discussions), we have put the entire concept on paper and will release the same pretty soon.

MVP
-

We will be releasing a Minimum Viable Product (or something that can actually sustain the narrative) of the dVPN which is released as a beta, but we believe will be stable for a while. This will constantly receive updates until the next major version.

Node Network
-

The Sentinel Node Network will also be better developed to work with all operating systems (currently supporting only Linux) and minor issues around the docker utilizing resources of the OS will be addressed when releasing documentation for the same.

References
-

1. Kelley, Micheal B. "Skype Could Be Helping The Feds Spy On US Citizens By Handing Over Chats." Business Insider, 26 July 2012, [www.businessinsider.com/skype-accused-of-helping-government-spy-on-people-2012-7](http://www.businessinsider.com/skype-accused-of-helping-government-spy-on-people-2012-7)

2. Granville, Kevin. "Facebook and Cambridge Analytica: What You Need to Know As Fallout Widens." _The New York Times - Breaking News, World News & Multimedia_, 19 Mar. 2018, www.nytimes.com/2018/03/19/technology/facebook-cambridge-analytica-explained.html

3. Bank of America to Pay $16.65 Billion in Historic Justice Department Settlement for Financial Fraud Leading Up to and During the Financial Crisis." _U.S. Department of Justice_, www.justice.gov/opa/pr/bank-america-pay-1665-billion-historic-justice-department-settlement-financial-fraud-leading.

4. "26 Amazing Skype Statistics and Facts (November 2017)." _DMR_, 2 Feb. 2016, expandedramblings.com/index.php/skype-statistics/.

5. "CLOUD Act." _Wikipedia, the Free Encyclopedia_, Wikimedia Foundation, Inc, 3 Apr. 2018, en.wikipedia.org/wiki/CLOUD_Act. Accessed 4 Apr. 2018.

# THE END

*******************
