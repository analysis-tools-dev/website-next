FROM node:20 as build
WORKDIR /src

COPY package.json package-lock.json /src/
RUN npm ci

ARG GH_TOKEN

COPY . /src

# Build runs npm run build-data (prebuild hook) which fetches tools data
# from GitHub repos and generates static JSON files, then runs next build
# Note: Votes will be skipped during build if GOOGLE_APPLICATION_CREDENTIALS is not set
RUN npm run build

FROM node:20
WORKDIR /src
COPY --from=build /src /src
ENTRYPOINT ["npm", "run", "start"]