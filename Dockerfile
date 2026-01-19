#syntax=docker/dockerfile:1
FROM node:lts-alpine
WORKDIR /openKanzlei
COPY . .
RUN apk update && apk add --no-cache openjdk17-jdk && yarn run setup
EXPOSE 3000 3001 8080 9093

CMD ["yarn", "run", "start"]

