# ------------------------------------------------------
# Build
# ------------------------------------------------------
FROM node:lts as builder
MAINTAINER Ivan Muratov "binakot@gmail.com"

RUN node --version &&\
    npm --version

WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build:prod

# ------------------------------------------------------
# Production
# ------------------------------------------------------
FROM nginx:alpine

COPY ./misc/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist /usr/share/nginx/html
