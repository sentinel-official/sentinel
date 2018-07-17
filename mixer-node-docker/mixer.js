let mongoose = require('mongoose');
let mixer = require('./mixer/index');
let mongoDbConfig = require('./config/vars').mongoDb;


let mongoDbUrl = `mongodb://${mongoDbConfig.address}:${mongoDbConfig.port}/${mongoDbConfig.dbName}`;
mongoose.connect(mongoDbUrl,
  (error, db) => {
    if (error) console.log(error);
    else {
      console.log(`Connected to database URL: ${mongoDbUrl}`);
      startMix();
    }
  });

let startMix = () => {
  mixer.start(() => {
    setTimeout(() => {
      startMix();
    }, 60 * 1000);
  });
};