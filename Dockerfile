FROM node:24 AS build
WORKDIR /src

COPY package.json package-lock.json /src/
RUN npm ci

ARG GH_TOKEN

COPY . /src

# Build runs npm run build-data (prebuild hook) which fetches tools data
# from GitHub repos and generates static JSON files, then runs next build
# Uses BuildKit secret for Firestore credentials during build
RUN --mount=type=secret,id=gcp_creds \
    export GOOGLE_APPLICATION_CREDENTIALS=/run/secrets/gcp_creds && \
    npm run build

FROM node:24
WORKDIR /src
COPY --from=build /src /src
ENTRYPOINT ["npm", "run", "start"]