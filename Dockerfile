FROM node:lts-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /action

# REVIEW:Do we need this
RUN npm i -g ts-node

COPY . .

RUN npm i

ENTRYPOINT ["/action/entrypoint.sh"]
