FROM node
WORKDIR /src

ADD package.json /src
ADD yarn.lock /src
RUN yarn install

ADD . /src

ENV GOOGLE_APPLICATION_CREDENTIALS=/src/firebase-key.json
RUN yarn run build

ENTRYPOINT ["yarn", "start"]
