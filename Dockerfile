FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY app/ /usr/src/app/
RUN npm i

EXPOSE 8080

CMD ["node", "server.js"]
