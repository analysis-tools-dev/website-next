FROM node
WORKDIR /src

ADD package.json /src
ADD package-lock.json /src
RUN npm install

ADD . /src

ENV GOOGLE_APPLICATION_CREDENTIALS=/src/firebase-key.json
RUN npm run build

ENTRYPOINT ["yarn", "start"]
