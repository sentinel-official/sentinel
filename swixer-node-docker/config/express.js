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
  let mongoDbUrl = `mongodb://${mongoDbConfig.address}:${mongoDbConfig.port}/${mongoDbConfig.dbName}`;
  let server = express();
  let corsOptions = {
    'origin': '*',
    'methods': 'GET, OPTIONS, PUT, POST, DELETE'
  };

  mongoose.connect(mongoDbUrl,
    (error, db) => {
      if (error) console.log(error);
      else console.log(`Connected to database URL: ${mongoDbUrl}`);
    });

  server.use(cors(corsOptions));
  server.use(morgan('combined'));
  server.use(compression());
  server.use(bodyParser.json({
    limit: '50mb'
  }));
  server.use(bodyParser.urlencoded({
    limit: '50mb',
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