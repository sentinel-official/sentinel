FROM alpine:3.7
# FROM evilthanos/sentinel-tm-socks5-v2:latest

ADD sentinel /root/sentinel

COPY speedtest.py speedtest-cli.py speedtest-cli /usr/lib/python2.7/site-packages/

COPY gaiacli wizard /usr/local/bin/

# RUN mv /root/config /root/config_backup
ADD app.py server.py run.sh config_backup /root/

ENV SENT_ENV=DEV

RUN echo '@testing http://nl.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories && \
    apk add --no-cache ca-certificates mongodb jq ufw@testing && \
    apk add --no-cache gcc python-dev musl-dev nano && \
    mkdir -p /data/db && \
    wget -c https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py && \
    python /tmp/get-pip.py && \
    pip install --no-cache-dir falcon gunicorn pymongo requests shadowsocks speedtest_cli && \
    pip install --no-cache-dir ipython && \
    chmod +x /usr/local/bin/gaiacli && chmod +x /usr/local/bin/wizard

# RUN mv /tmp/gaiacli /usr/local/bin/ && \
#     mv /tmp/speedtest.py speedtest-cli.py /usr/lib/python2.7/site-packages/ && \
#     mv /tmp/speedtest-cli.py /usr/lib/python2.7/site-packages/ && \
#     mv /tmp/speedtest-cli /usr/local/bin

RUN rm -rf /tmp/* /var/tmp/* /var/cache/apk/* /var/cache/distfiles/* /root/.cache .wget-hsts

EXPOSE 3000 4200 4201 4202 4203 4204

CMD ["wizard"]
