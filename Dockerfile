FROM ubuntu:16.04

MAINTAINER Maarten van Meersbergen <m.vanmeersbergen@esciencecenter.nl>
RUN apt-get update -y

RUN apt-get install build-essential -y

RUN apt-get install git -y
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

WORKDIR /home/

RUN git clone https://github.com/NLeSC/ahn-pointcloud-viewer
WORKDIR /home/ahn-pointcloud-viewer

RUN npm install -g bower grunt-cli

RUN apt-get install ruby-dev libffi-dev -y
RUN gem install compass

RUN npm install
RUN bower install --allow-root

EXPOSE 9000

CMD grunt serve --force
