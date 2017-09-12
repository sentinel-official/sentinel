FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y software-properties-common

RUN add-apt-repository -y ppa:ethereum/ethereum

RUN apt-get update && \
    apt-get install -y bootnode

RUN apt-get remove --purge -y software-properties-common && \
    apt-get -y autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN bootnode -genkey bootnode.key

EXPOSE 30301 30301/udp

CMD ["bootnode", "-nodekey", "bootnode.key", "--verbosity", "6"]
