let mongoose = require('mongoose');
let swixer = require('./swixer/index');
let mongoDbConfig = require('./config/vars').mongoDb;


let mongoDbUrl = `mongodb://${mongoDbConfig.address}:${mongoDbConfig.port}/${mongoDbConfig.dbName}`;
let startSwix = (error, list) => {
  swixer.start((error, list) => {
    setTimeout(() => {
      startSwix();
    }, 60 * 1000);
  });
};
mongoose.connect(mongoDbUrl,
  (error, db) => {
    if (error) console.log(error);
    else {
      console.log(`Connected to database URL: ${mongoDbUrl}`);
      startSwix();
    }
  });