FROM ubuntu:16.04

WORKDIR /sentinel

ADD . /sentinel

RUN apt-get update && \
    apt-get install -y software-properties-common python3-minimal

RUN add-apt-repository -y ppa:ethereum/ethereum

RUN apt-get update && \
    apt-get install -y geth

RUN apt-get remove --purge -y software-properties-common && \
    apt-get -y autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 30303 30303/udp
EXPOSE 8545

CMD ["python3", "node/run.py"]
