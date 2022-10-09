FROM node:16.17.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .
