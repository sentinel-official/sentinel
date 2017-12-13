FROM alpine:3.6

ADD bootnode.sh genesis.json /root/

RUN echo '@community http://nl.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories && \
    apk add --no-cache geth@community wget && \
    rm -rf /tmp/* /var/tmp/* /var/cache/apk/* /var/cache/distfiles/*

EXPOSE 30303 30303/udp

ENTRYPOINT ["sh", "/root/bootnode.sh"]
