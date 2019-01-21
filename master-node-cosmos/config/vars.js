let server = {
  port: 8000
};

let mongoDb = {
  address: '127.0.0.1',
  port: 27017,
  username: '',
  password: '',
  dbName: 'sentinel'
};

let GB = 1.0 * 1024 * 1024 * 1024;

module.exports = {
  server,
  mongoDb,
  GB
};