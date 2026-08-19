#

ARG NODE_VERSION="24.13"

FROM docker.io/node:${NODE_VERSION}-alpine AS build
RUN apk add --no-cache make g++
WORKDIR "/dora"
COPY package*.json tsconfig.json eslint.config.js .prettierrc vite.config.ts index.html ./
COPY src src
COPY public public
ARG NODE_ENV VITE_NODE_NEO3_MAINNET VITE_NODE_NEO3_TESTNET

RUN npm install
RUN npx browserslist@latest --update-db
RUN npm run build

FROM scratch
WORKDIR "/dora"
COPY --from=build /dora/dist .
