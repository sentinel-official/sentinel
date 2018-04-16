About Sentinel
===

![Sentinel Network](https://preview.ibb.co/mJcfOS/Sentinel_Logo.png)

Sentinel, an open source project, has been in the works since mid-2017. The project started off as an answer to circumventing issues with TOR but soon evolved to the stage where the access to information and secure communication had to be addressed before getting to TOR. With that said, the goal is to develop a decentralized suite of products that secure access to information and enables secure communication.

The first among the suite of products is the decentralized Virtual Private Network or simply, dVPN. Why? To ensure secure access to everyday browsing before anything else.

What are products that are part of the Sentinel Communications Suite?
-

- **dVPN** - Decentralized Virtual Private Network
- **dChat** - Decentralized peer-to-peer Messaging - includes media, files, etc.
- **dVoIP** - Decentralized peer-to-peer Voice over Internet Protocol for calls and delivery of real-time/streaming audio data

Who can use or associate with Sentinel?
-

- People that utilize the Secure Communication Suite are Sentinel's *Consumers* or *Users*.
- People that provide resources and run the Sentinel Network are *Service Providers*
- People that have a high reputation when providing services tend to eventually become Master Nodes, which are nodes that handle transactional data of multiple services as opposed to a single service by a *Service Provider* 

Where is the majority of our development time invested?
-

- Development of the Wallet
- Development of the dVPN Client
- Development of the Node deployment infrastructure

Where is the majority of our research time invested?
-

- **Identity Management**

    How does one manage this anonymous, federated identity? Should it be federated at all?

    The team has come to consensus with something called the AUID, Anonymous User ID, that will be the single point of information exchange between the User and the Service Provider. The team is considering the possibility of keeping this chain independent from the other chains, Services and Transactions. This chain will only communicate them as and when requested for and required during the workflow of a transaction.

- **Services Management**

    Since Sentinel aims to develop a suite like say GSuite/Google Apps for Work, we will potentially encounter more transactions than any other blockchain dedicatedly developed for a dVPN might receive.
    
    The team has researched multiple DAOs that have smart contract capabilities and is inclined towards the use of engines like TenderMint for the development of the Service Chain - a chain, that has to communicate with the AUID Chain and the Transaction chain to authenticate, deliver services and address issues if any when delivering *services*. 

- **Transactions Management**
    
    Sentinel, as you understand now, intends to use inter-chain communication among other things for efficient scaling and delivery of services. Owing to the possibility of Users using multiple services and Service Providers sharing multiple resources concurrently, Sentinel undergoes a massive load during Transaction processing.
    
    The current transaction chain is based on Ethereum which offers ERC20, a very standard protocol for transactions. Current gas prices and transaction speeds forced the team to think of ways to diversify and connect chains running on multiple protocols - for example, TenderMint as stated earlier.

What about the Tokens used?
-

Currently, there exists only 1 token i.e. $SENT, which is an ERC20 token tradable on multiple platforms and exchanges.

Now, if the Service Chain is implemented as stated above, the Sentinel Network will see a new token on the Service Chain, that is used exclusively to access Services and pay for them.

#### How does the exchange happen?

Through a Swap Zone, this token will be exchanged for the token on the Transactions Chain. This swap zone will have an inbuilt 'Anonymous Mixer', which accepts inputs of both tokens (Service Chain & Transactions Chain) and output the swapped token.

Extended capabilities of the Mixer can be best demonstrated when running a DEx (decentralized exchange) where, Users of the DEx can run their ERC20 Tokens through the Mixer, which then gives back the User equivalent pegged tokens, whatever that might be.

Considering the use of TenderMint for the development of the Service Chain, swap of Sentinel Service Tokens ($SENT-SST) will be initially with $SENT. Given the possibilities and opportunities on the Cosmos Network and various Zones within, the Sentinel Mixer can also swap various tokens and assets developed on TenderMint and within Cosmos.

What are we up to right now?
-

Currently we have worked on and released the **Sentinel Desktop Client - Alpha (v0.0.31)** which can be downloaded from here:

- [  Mac OS x64](https://github.com/sentinel-official/sentinel/releases/download/v0.0.31-alpha/Sentinel-macosx-0.0.31-alpha.dmg)
- [  Windows x64 ](https://github.com/sentinel-official/sentinel/releases/download/v0.0.31-alpha/Sentinel-win64-0.0.31-alpha.exe)
- [  Linux x64 ](https://github.com/sentinel-official/sentinel/releases/download/v0.0.31-alpha/Sentinel-linux64-0.0.31-alpha.deb)

The current Desktop Client has 2 primary components:

- Wallet
    
    Capable of handling `$ETH`, `$SENT` and `$SENTTEST`

- dVPN

    To test the dVPN, Users can use `$SENTTEST` which are test tokens created to replicate the functionality of the Service Chain Tokens ($SENT-SST).
    
What can you do to support Sentinel Network?
-

If you really want to help and run a Linux System at home or on a server (in a VPS), it will be of great help if you can run the Sentinel dVPN Node and help us test the network.

Instructions on running a node are listed [here](https://github.com/sentinel-official/sentinel/blob/master/vpn-node-docker/README.md).

If you are an enthusiastic and want to evangelize $SENT, please use the dVPN and let us know issues through our Telegram Channel (available on our website - SentinelGroup.io)

What's something interesting we are coming up with?
-

A lot actually.

- **Website**

    There will be a new version of the website with complete project information, token details, exchanges listed, partnerships, enterprises and projects Sentinel has collaborated with and of course, the roadmap. Also, we have an exciting new domain and we will be migrating away from sentinelgroup.io eventually.

- **White Paper**

    Owing the busy research and product development schedule (and the infinite iterations that are an output of a similar number of discussions), we have put the entire concept on paper and will release the same pretty soon.
    
- **MVP**

    We will be releasing a Minimum Viable Product (or something that can actually sustain the narrative) of the dVPN which is released as a beta, but we believe will be stable for a while. This will constantly receive updates until the next major version.

    PS: Just for kicks we are planning on developing the Service Chain of the MVP using TenderMint. Let's see how far that goes.
    
- **Node Network**

    The Sentinel Node Network will also be better developed to work with all operating systems (currently supporting only Linux) and minor issues around the docker utilizing resources of the OS will be addressed when releasing documentation for the same.

If there's anything you would like to know, reach us out by checking the website or if it's development released, you can always raise an issue on GitHub and we will be more than happy to help you get things sorted.
