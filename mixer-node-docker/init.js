let readline = require('readline');
let mongoose = require('mongoose');
let { getBalance } = require('./ethereum/accounts');
let { generatePublicKey, generateAddress } = require('./ethereum/keys');
let accountDbo = require('./server/dbos/account.dbo');
let mongoDbConfig = require('./config/vars').mongoDb;


let mongoDbUrl = `mongodb://${mongoDbConfig.address}:${mongoDbConfig.port}/${mongoDbConfig.dbName}`;
mongoose.connect(mongoDbUrl,
  (error, db) => {
    if (error) console.log(error);
    else {
      console.log(`Connected to database URL: ${mongoDbUrl}`);
      let privateKeysCount = 0;
      let rl = readline.createInterface(process.stdin, process.stdout);
      rl.on('line', (line) => {
        let privateKey = line.toString().trim();
        if (privateKey.match(/^[a-fA-F0-9]{64}$/)) {
          let publicKey = generatePublicKey(Buffer.from(privateKey, 'hex'), false);
          let address = generateAddress(publicKey).toString('hex');
          let account = {
            address: address,
            privateKey: privateKey,
            generatedOn: Math.round(Date.now() / Math.pow(10, 3)),
            balances: {
              eth: getBalance(address, 'main')
            }
          };
          console.log(`Found balance in account address ${account.address} is ${account.balances.eth}`);
          accountDbo.insertAccount(account,
            (error, result) => {
              if (error) console.log(error);
              else {
                ++privateKeysCount;
                if (privateKeysCount === 10) {
                  rl.close();
                  mongoose.connection.close();
                }
              }
            });
        } else console.log('Entered wrong Private key!');
      });
      rl.on('close', () => {
        console.log('Successfully inserted accounts details.');
      });
      rl.prompt();
    }
  });
