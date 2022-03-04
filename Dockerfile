FROM node:lts

WORKDIR /action

RUN npm i -g ts-node

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

ENTRYPOINT ["/action/entrypoint.sh"]
