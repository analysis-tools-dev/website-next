FROM node as build
WORKDIR /src

RUN mkdir /src/.cache

ADD package.json /src
ADD package-lock.json /src
RUN npm install

ENV GOOGLE_APPLICATION_CREDENTIALS=/src/credentials.json
ENV FIREBASE_PROJECT_ID=analysis-tools-dev
ARG GH_TOKEN
ARG PROJECT_ID

ADD . /src
RUN --mount=type=volume,target=/src/.cache,volume-driver=local,volume-opt=type=none,volume-opt=o=bind,volume-opt=device=.cache \
    echo "Persisting /src/.cache directory"
RUN npm run build
RUN rm /src/credentials.json

FROM node
WORKDIR /src
ENTRYPOINT ["npm", "run", "start"]

COPY --from=build /src /src
