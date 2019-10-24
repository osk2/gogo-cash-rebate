FROM node:12-slim

WORKDIR /src
ADD . /src

ARG env=production

RUN yarn

WORKDIR /src
EXPOSE 9090
ENV NODE_ENV $env
ENV LC_ALL C.UTF-8
CMD ["npm", "start"]
