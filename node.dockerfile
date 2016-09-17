FROM ubuntu:14.04

RUN export PORT=3000

RUN apt-get -y update && apt-get -y install supervisor

RUN export NODE_ENV=production

COPY /misc/node.conf ./etc/supervisor/supervisor.conf

VOLUME ['/src/log']

CMD 'supevisord start'

EXPOSE $PORT