FROM alpine:3.6

ADD sentinel /root/sentinel

ADD run.py /root/

ENV ACCOUNT_ADDR=''

RUN echo '@testing http://nl.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories && \
    apk add --no-cache ca-certificates easy-rsa openvpn ufw@testing wget nano gcc python-dev musl-dev && \
    wget -c https://bootstrap.pypa.io/get-pip.py && \
    python get-pip.py && pip install ipython requests speedtest_cli

EXPOSE 1194/udp

CMD ["python", "/root/run.py"]
