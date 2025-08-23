FROM node:20 as build
WORKDIR /src

COPY package.json package-lock.json /src/
RUN npm ci

ENV GOOGLE_APPLICATION_CREDENTIALS=/src/credentials.json
ENV FIREBASE_PROJECT_ID=analysis-tools-dev
ARG GH_TOKEN
ARG PROJECT_ID

COPY . /src

# Download tools.json directly in Dockerfile and detect changes
# This is done to ensure that we redeploy the app whenever the tools.json changes
ADD https://raw.githubusercontent.com/analysis-tools-dev/static-analysis/master/data/api/tools.json /src/data/api/tools.json

RUN npm run build
RUN rm /src/credentials.json /src/data/api/tools.json

FROM node:20
WORKDIR /src
COPY --from=build /src /src
ENTRYPOINT ["npm", "run", "start"]
