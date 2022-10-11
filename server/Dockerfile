FROM node:14-alpine3.10

LABEL maintainer="Mario Mixtega <mariomixtega@yahoo.com>"

ENV PORT=4000

WORKDIR /taskAPI
COPY . /taskAPI

RUN yarn install
RUN yarn run build

EXPOSE 4000

CMD yarn run start