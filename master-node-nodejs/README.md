Sentnel node js repository

# Get Started

- [Installation](https://github.com/EQuimper/nodejs-api-boilerplate#installation)
- [Install Mongodb](https://github.com/EQuimper/nodejs-api-boilerplate#install-mongodb)
- [Raven Log](https://github.com/EQuimper/nodejs-api-boilerplate#raven-log)
- [Body Whitelist](https://github.com/EQuimper/nodejs-api-boilerplate#body-whitelist)
- [Api Doc](https://github.com/EQuimper/nodejs-api-boilerplate#api-doc)
- [Pre-Commit Hook](https://github.com/EQuimper/nodejs-api-boilerplate#pre-commit-hook)
- [Scripts](https://github.com/EQuimper/nodejs-api-boilerplate#scripts)
- [Dev-Debug](https://github.com/EQuimper/nodejs-api-boilerplate#dev-debug)
- [Why toJSON() on methods model](https://github.com/EQuimper/nodejs-api-boilerplate#why-tojson-on-methods-model-)
- [For validation on request](https://github.com/EQuimper/nodejs-api-boilerplate#for-validation-on-request)
- [Seeds](https://github.com/EQuimper/nodejs-api-boilerplate#seeds)
- [Docker](https://github.com/EQuimper/nodejs-api-boilerplate#docker)
- [Techs](https://github.com/EQuimper/nodejs-api-boilerplate#techs)
- [Todo](https://github.com/EQuimper/nodejs-api-boilerplate#todo)

## Build

This Boilerplate use webpack 3 to compile code.

## Installation

1. Clone the project `git clone https://github.com/sentinel-official/sentinel.git`.
2. Install dependencies `yarn install` or `npm install` after installing dependencies run `npm run build`
3. Create a `.env` file in the root like the `.env.example` file.
4. For dev you need to have mongodb db locally. 

---

## Install Mongodb
MAC

With Homebrew you can just run `brew install mongodb` and after `brew services start mongodb`.

UBUNTU

With `apt-get update && apt-get install mongodb`
---

## Raven Log

For get raven log create account here: [Sentry](https://sentry.io/)

---


---

## Api Doc

Api doc his hosted on surge. [Link](http://equimper-nodejs-api-boilerplate.surge.sh/). For change the url and have your own docs just add you link in the `.env` file.

---

---


### DEV

```
yarn dev
```

or

```
npm run dev
```

**PS** That can crash if this is the first time but don't worry give it 2 sec the scripts gonna work. He just need to created a dist folder :) This way you have only one command to run.

### DEV-DEBUG

```
yarn dev:debug
```

or

```
npm run dev:debug
```

---

## Why toJSON on methods model ?



```

```

---

## For Validation on Request

I'm using Joi in this boilerplate, that make the validation really easy.

```js
export const validation = {
  create: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      username: Joi.string().min(3).max(20).required(),
    },
  },
};

```

---

Monitoring Server on `http://localhost:3000`

---


---

## Techs

- [Cors](https://github.com/expressjs/cors)
- [Body-Parser](https://github.com/expressjs/body-parser)
- [Raven](https://github.com/getsentry/raven-node)
- [Joi](https://github.com/hapijs/joi)
- [Husky](https://github.com/typicode/husky)
- [Prettier](https://github.com/prettier/prettier)
- [Mocha](https://github.com/mochajs/mocha)
- [Chai](https://github.com/chaijs/chai)
- [NPS](https://github.com/kentcdodds/nps)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](http://mongoosejs.com/)
- [Webpack3](https://webpack.js.org/)

---



