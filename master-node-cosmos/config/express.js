let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let methodOverride = require('method-override');
let morgan = require('morgan');
let path = require('path');
let compression = require('compression');
let mongoose = require('mongoose');
let utils = require('./utils');
let mongoDbConfig = require('./vars').mongoDb;


let initServer = () => {
  let { username,
    password,
    address,
    port,
    dbName } = mongoDbConfig;
  mongoDbUrl = `mongodb://${address}:${port}/${dbName}`;
  if (username.length && password.length) mongoDbUrl = `mongodb://${username}:${password}@${address}:${port}/${dbName}`;
  let server = express();
  let corsOptions = {
    'origin': '*',
    'methods': 'GET, OPTIONS, PUT, POST, DELETE'
  };

  mongoose.connect(mongoDbUrl, {
    poolSize: 24,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    useNewUrlParser: true,
  }, (error, db) => {
    if (error) console.log(error);
    else console.log(`Connected to database URL: ${mongoDbUrl}`);
  });

  server.use(cors(corsOptions));
  server.use(morgan('combined'));
  server.use(compression());
  server.use(bodyParser.json({
    limit: '1mb'
  }));
  server.use(bodyParser.urlencoded({
    limit: '1mb',
    extended: true
  }));
  server.use(methodOverride());

  server.get('/',
    (req, res) => {
      res.send({
        status: 'up'
      });
    });

  utils.getGlobbedFiles('./server/routes/*.js').forEach((routePath) => {
    console.log('routePath', routePath);
    require(path.resolve(routePath))(server);
  });

  return server;
};

module.exports = {
  initServer
};
