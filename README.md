# Lightest

## Table of contents

- [Introduction](#introduction)
- [About](#about)
- [Technologies used](#technologies-used)
- [Downloading](#downloading)
- [Prerequisites for assembly and launch](#prerequisites-for-assembly-and-launch)
- [Building](#building)
- [Launch of the project](#launch-of-the-project)
  - [Backend application](#backend-application)
  - [Frontend application](#frontend-application)

## Introduction

You can try this application in action by following this [link](https://endearing-caramel-35cf97.netlify.app/).

## About

A simple app for creating and taking tests.

Implemented functions:

- registration
- login
- account activation via email (_does not work in production, as the server is deployed on [Render](https://render.com/)_) (_account activation does not affect the list of features available to the user_)
- 3 types of questions:
  - with a short answer
  - with one correct answer on the list
  - with multiple correct answers on the list
- creating tests
- editing your own tests
- passing your own and other people's tests
- viewing the results of completed tests

## Technologies used

The project uses the following technologies:

- on the backend and frontend

  - [zod](https://zod.dev/) — library for schema-based data validation
  - [ts-rest](https://ts-rest.com/) — simple cross-stack type-safety for your API, with just a sprinkle of TypeScript magic

- only on the backend

  - [Node.js](https://nodejs.org/en/) — JavaScript runtime environment
  - [Express](https://expressjs.com/) — fast, unopinionated, minimalist web framework for Node.js
  - [PostgreSQL](https://www.postgresql.org/) — relational database management system
  - [Drizzle ORM](https://orm.drizzle.team/) — headless TypeScript ORM with a head
  - [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — password hashing library
  - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — library for working with JSON web tokens

- only on the frontend
  - [Vue.js](https://vuejs.org/) — framework for creating web user interfaces
  - [Vue Router](https://router.vuejs.org/) — routing library for Vue.js
  - [Pinia](https://pinia.vuejs.org/) — state management library for Vue.js
  - [Axios](https://axios-http.com/) — simple promise-based HTTP client
  - [shadcn-vue](https://www.shadcn-vue.com/) — an unofficial, community-led Vue port of shadcn/ui
  - [Tailwind CSS](https://tailwindcss.com/) — a utility-first CSS framework

## Downloading

To download the project, run the following commands:

```sh
git clone https://github.com/m4rc0d3r/lightest.git
```

## Prerequisites for assembly and launch

To build and run the project, the following programs must be installed on your computer:

- [Node.js](https://nodejs.org/en/) — JavaScript runtime environment
- [PnPM](https://pnpm.io/) — fast, disk space efficient package manager ([installation manual](https://pnpm.io/installation))

Commands to build and run the project must be executed from the project root directory.

Before building or running a project, you must specify the required environment variables.

Create an environment variables file by doing one of the following, depending on your operating system.

On Linux, run the following commands:

```sh
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
```

On another operating system, create copies of the `.env.example` files named `.env`.

Note: Most variables in .env files are already set up for running the project locally.

## Building

First, you need to install the dependencies.
This can be done using the following command:

```sh
pnpm install
pnpm --filter @lightest/server... build
pnpm --filter @lightest/client... build
```

## Launch of the project

### Backend application

To run the application, run the following commands:

```sh
cd apps/server
pnpm start:prod
```

### Frontend application

To run the application, run the following commands:

```sh
cd apps/client
pnpm preview
```
