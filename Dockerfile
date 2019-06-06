FROM node:12-slim

WORKDIR /src
ADD . /src

ARG env=production

RUN apt-get update \
  && apt-get install build-essential git vim -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN yarn global add bower \
  && bower install --allow-root \
  && yarn

WORKDIR /src
EXPOSE 9090
ENV NODE_ENV $env
CMD ["npm", "start"]
