FROM node
WORKDIR /src

ADD package.json /src
ADD yarn.lock /src
RUN yarn install

ADD . /src

RUN yarn run build

ENTRYPOINT ["yarn", "start"]
