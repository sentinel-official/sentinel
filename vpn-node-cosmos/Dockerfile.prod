FROM golang:alpine3.7 AS deps

RUN apk add git gcc linux-headers make musl-dev wget
RUN go get -u github.com/golang/dep/cmd/dep && \
    mkdir -p /go/src/github.com/cosmos && \
    cd /go/src/github.com/cosmos && \
    git clone --depth 1 --branch develop https://github.com/sentinel-official/cosmos-sdk.git && \
    cd /go/src/github.com/cosmos/cosmos-sdk && \
    dep ensure -v && \
    make install
RUN cd /root && \
    wget https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py
RUN apk add alpine-sdk && \
    adduser -D packager && \
    addgroup packager abuild && \
    mkdir -p /tmp/packages/ && \
    chown -hR packager /tmp/packages/ && \
    chgrp -hR packager /tmp/packages/ && \
    cd /tmp/packages/ && \
    curl https://git.alpinelinux.org/aports/plain/testing/ufw/APKBUILD?id=b56db2c574082de52cee8109469fb5da4cbcb046 -o APKBUILD && \
    curl https://git.alpinelinux.org/aports/plain/testing/ufw/ufw.initd?id=b56db2c574082de52cee8109469fb5da4cbcb046 -o ufw.initd && \
    su -c 'abuild-keygen -a -i' packager && \
    su -c 'abuild -r' packager

FROM alpine:3.7

COPY --from=deps /go/bin/gaiacli /usr/local/bin/
COPY --from=deps /root/speedtest.py /usr/lib/python2.7/site-packages/
COPY --from=deps /home/packager/packages/tmp/x86_64/ufw-0.35-r1.apk /tmp/

ADD sentinel /root/sentinel
ADD app.py run.sh config /root/

RUN apk add --no-cache ca-certificates easy-rsa mongodb openvpn python2 && \
    apk add --no-cache /tmp/ufw-0.35-r1.apk --allow-untrusted && \
    mkdir -p /data/db && \
    wget -c https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py && \
    python2 /tmp/get-pip.py && \
    pip2 install --no-cache-dir falcon gunicorn pymongo requests
RUN rm -rf /tmp/* /var/tmp/* /var/cache/apk/* /var/cache/distfiles/* /root/.cache .wget-hsts

ENTRYPOINT ["sh", "/root/run.sh"]
