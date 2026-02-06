FROM node:20 as build
WORKDIR /src

COPY package.json package-lock.json /src/
RUN npm ci

ENV GOOGLE_APPLICATION_CREDENTIALS=/src/credentials.json
ENV FIREBASE_PROJECT_ID=analysis-tools-dev
ARG GH_TOKEN
ARG PROJECT_ID

COPY . /src

# Build runs npm run build-data (prebuild hook) which fetches tools data
# from GitHub repos and generates static JSON files, then runs next build
RUN npm run build
RUN rm /src/credentials.json

FROM node:20
WORKDIR /src
COPY --from=build /src /src
ENTRYPOINT ["npm", "run", "start"]
