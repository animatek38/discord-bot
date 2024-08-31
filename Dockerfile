ARG NODE_VERSION=18.16.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

USER node

COPY . .

RUN npm run start
