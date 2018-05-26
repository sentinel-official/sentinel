let server = require('./config/express').initServer();
let serverConfig = require('./config/vars').server;


server.listen(serverConfig.port);
console.log();
console.log(`Server is running on port: ${serverConfig.port}`);
