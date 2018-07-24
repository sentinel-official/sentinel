let server = {
  port: 3001
};

let mongoDb = {
  address: '127.0.0.1',
  port: 27017,
  dbName: 'sentinelSwixer'
};

let decimals = {
  'PIVX': 0,
  'SENT': 8,
  'ETH': 18,
  'BNB': 18
}

module.exports = {
  server,
  mongoDb,
  decimals
};