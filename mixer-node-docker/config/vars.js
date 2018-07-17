let server = {
  port: 3000
};

let mongoDb = {
  address: '127.0.0.1',
  port: 27017,
  dbName: 'sentinel-mixer'
};

module.exports = {
  server: server,
  mongoDb: mongoDb
};