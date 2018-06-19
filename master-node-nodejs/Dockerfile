FROM node:8-alpine

WORKDIR /root/

ADD . /root/sentinel

ADD run.sh /root/

RUN apk update && apk upgrade && apk add bash g++ gcc gmp-dev libffi-dev make python2 python3 mongodb redis nano git  && mkdir -p /data/db

CMD [ "sh", "run.sh" ]

EXPOSE 3000
