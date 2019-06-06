FROM node:12-alpine

WORKDIR /src
ADD . /src

ARG env=production

RUN yarn global add bower \
  && bower install \
  && yarn

WORKDIR /src
EXPOSE 9090
ENV NODE_ENV $env
CMD ["npm", "start"]
