let mixer = require('./mixer/index');
let mongoose = require('mongoose');
let mongoDbConfig = require('./config/vars').mongoDb;


let mongoDbUrl = `mongodb://${mongoDbConfig.address}:${mongoDbConfig.port}/${mongoDbConfig.dbName}`;
mongoose.connect(mongoDbUrl,
  (error, db) => {
    if (error) console.log(error);
    else {
      console.log(`Connected to database URL: ${mongoDbUrl}`);
      mixer.start();
    }
  });
