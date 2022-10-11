# Task Manager API

This is a repository that contains an API to manage tasks.

## Tech Stack
* GraphQL
* Postgres
* NodeJS (But using ts)
* Express
* Apollo Server

## How to run

* Docker compose

  1.- `cd` into `server` folder

  2.- Run `docker build . -t task-api`

  3.- `cd` to the top folder and run `docker compose up`

* Just run `run.sh` at top folder, it would do all the steps for you

* Manual run

  1.- `cd` into `server` folder

  2.- Install dependencies with `yarn install`

  3.- Look at `.env.example` and replace the dummy values with your own values

  4.- Run `yarn run start`

## Run tests

For run the tests, make sure to install the dependencies first, then run `yarn run test`
