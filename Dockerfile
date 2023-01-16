FROM node as build
WORKDIR /src

ADD package.json /src
ADD package-lock.json /src
RUN npm install

ENV GOOGLE_APPLICATION_CREDENTIALS=/src/credentials.json
ENV FIREBASE_PROJECT_ID=analysis-tools-dev
ARG GH_TOKEN
ARG PROJECT_ID

ADD . /src
RUN npm run build
RUN rm /src/credentials.json

FROM node
WORKDIR /src
ENTRYPOINT ["npm", "run", "start"]

COPY --from=build /src /src
