# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.5.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i -g pnpm

RUN pnpm i

RUN npx prisma generate

RUN pnpm build

USER node

CMD node ./build/index.js
