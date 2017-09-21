FROM ubuntu:16.04

MAINTAINER Maarten van Meersbergen <m.vanmeersbergen@esciencecenter.nl>
RUN apt-get update -y

RUN apt-get install locales -y

RUN locale-gen en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV LANG=en_US.UTF-8

RUN apt-get install build-essential -y

RUN apt-get install git -y
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

ADD . /app
WORKDIR /app

RUN npm install -g bower grunt-cli

RUN apt-get install ruby-dev libffi-dev -y
RUN gem install compass

RUN npm install
RUN bower install --allow-root

EXPOSE 9000

CMD grunt serve --force
