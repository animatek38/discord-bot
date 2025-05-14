#ARG NODE_VERSION=18.16.1

#FROM node:${NODE_VERSION}-alpine

FROM nikolaik/python-nodejs:latest

USER pn

WORKDIR /home/pn

COPY . /home/pn

RUN npm install

ENTRYPOINT npm run start
