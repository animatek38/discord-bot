#ARG NODE_VERSION=18.16.1

#FROM node:${NODE_VERSION}-alpine

FROM nikolaik/python-nodejs:latest

USER pn

ENV PATH="$PATH:/home/pn/.local/bin:/home/pn/node_modules/ffmpeg-static"

WORKDIR /home/pn

COPY . /home/pn

RUN npm install

RUN pip install yt-dlp

ENTRYPOINT npm run start
