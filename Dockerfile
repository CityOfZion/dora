#

ARG NODE_VERSION="14.16"

FROM docker.io/node:${NODE_VERSION}-alpine AS build
RUN apk add --update --no-cache python2 make g++
WORKDIR "/dora"
COPY package*.json tsconfig.json .eslintrc .prettierrc ./
COPY src src
COPY public public
RUN npm install
RUN npx browserslist@latest --update-db
RUN npm run build

FROM scratch
WORKDIR "/dora"
COPY --from=build /dora/build .
