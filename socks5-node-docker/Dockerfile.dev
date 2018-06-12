FROM alpine

ADD sentinel /root/sentinel

ADD app.py server.py run.sh /root/

ENV SENT_ENV=DEV

RUN echo '@testing http://nl.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories && \
    apk add --no-cache ca-certificates easy-rsa mongodb openvpn ufw@testing && \
    apk add --no-cache gcc python-dev musl-dev nano && \
    mkdir -p /data/db && \
    wget -c https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py && \
    python /tmp/get-pip.py && \
    pip install --no-cache-dir falcon gunicorn pymongo requests speedtest_cli shadowsocks && \
    pip install --no-cache-dir ipython && \
    rm -rf /tmp/* /var/tmp/* /var/cache/apk/* /var/cache/distfiles/* /root/.cache .wget-hsts

EXPOSE 1194/udp 3000 4201 4202 4203 4204

CMD ["sh", "/root/run.sh"]
