FROM ubuntu:16.04

WORKDIR /sentinel

ADD . /sentinel

RUN apt-get update && \
    apt-get install -y software-properties-common wget gcc python3-dev

RUN add-apt-repository -y ppa:ethereum/ethereum

RUN apt-get update && \
    apt-get install -y ethereum

RUN wget -O /tmp/get-pip.py 'https://bootstrap.pypa.io/get-pip.py' && \
    python3 /tmp/get-pip.py && \
    pip3 install -r requirements.txt

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 30303 30303/udp

CMD ["python3", "node/run.py"]
