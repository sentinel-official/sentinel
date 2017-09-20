FROM ubuntu:16.04

WORKDIR /sentinel

ADD run.py /sentinel

ENV BOOTNODE_URL='None' \
    BOOTNODE=False \
    MINER='False' \
    CONSOLE='False' \
    V5='False' \
    NODE_NAME='' \
    ETHERBASE=''

RUN apt update && \
    apt install -y software-properties-common python3-minimal wget

RUN add-apt-repository -y ppa:ethereum/ethereum

RUN apt update && \
    apt install -y geth bootnode

RUN wget -O /tmp/get-pip.py 'https://bootstrap.pypa.io/get-pip.py' && \
    python3 /tmp/get-pip.py

RUN apt remove --purge -y software-properties-common wget && \
    rm /tmp/get-pip.py && \
    apt -y autoremove && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 30301/udp 30303 30303/udp 30304/udp 8545

CMD ["python3", "run.py"]
