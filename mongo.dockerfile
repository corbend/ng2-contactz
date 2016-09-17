FROM ubuntu:14.04

COPY ./mongo/mongodb-linux-x86_64-3.2.8.tgz 

RUN apt-get -y update && apt-get install -y curl nano && \
	tar -zxvf mongodb-linux-x86_64-3.2.8.tgz && \
	mkdir -p mongodb && \
	mkdir -p /data/db
	cp -R -n mongodb-linux-x86_64-3.2.8/ mongodb
	export PATH=/mongodb/bin:$PATH

VOLUME ['./mongo/data:/data']

CMD ['service', 'mongo', 'start']

EXPOSE 27001