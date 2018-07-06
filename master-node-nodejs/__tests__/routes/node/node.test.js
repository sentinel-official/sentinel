import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../../src";

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

const registerRoute = '/api/node/register'; //POST
const accountRoute = '/api/node/account'; //POST
const balanceRoute = '/api/node/account/balance'; //POST
const deregisterRoute = '/api/node/deregister'; //POST
const updateNodeRoute = '/api/node/update-nodeinfo' //POST

const registerUserDetails = {
  account_addr: '0xd16e64a4083bd4f973df66b75ab266987e509fe6',
  price_per_gb: 10,
  ip: '183.82.119.118',
  location: {
    lattitude: 17.3753,
    longitude: 78.4744,
    city: 'Hyderabad',
    country: 'India',
  },
  net_speed: {
    download: 335544320,
    upload: 335544320,
  },
  vpn_type: 'openvpn',
}

const payVpnUsageDetails = {
  payment_type: 'normal',
  tx_data: '0xf9012c8307a12084773594008307a1209411cb41b3b9387ccfa9cbf71525fa658107d2e3fd80b8c4ac4c60b7000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe6000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe600000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000015af1d78b5000000000000000000000000000000000000000000000000000000005aa260be1ba0856e010080c96d45dad83f93180895d5fa84222ada7bfd5dfcfa9579a5637343a0721a79dcb5cde7f6ff651ff503841f946204cc7169402d45b699d50ca1acd9ea',
  net: 'rinkeby',
  from_addr: '0xd16e64a4083bd4f973df66b75ab266987e509fe6',
  amount: '00',
  session_id: '6c0ae80bae6806e65b488d3a482d9adb',
}

const correctDetails = {
  password: 'password',
  account_addr: '0xd16e64a4083bd4f973df66b75ab266987e509fe6',
  token: '9f8b38b0-f7d2-47a8-a631-298cdf4b8d12'
}

const nodeInfoLocation = {
  account_addr: "0xbc3e6c969156de7c90dfedd64dc61bc9e1eabdf8",
  token: "8b2484237c9748ed89f57f413d3de647",
  info: {
    "type": 'location',
    "location": {
      "latitude": 30.7343,
      "longitude": 76.7933,
      "city": "Chandigarh",
      "country": "India"
    },
  }
}

const nodeInfoNetspeed = {
  account_addr: "0xbc3e6c969156de7c90dfedd64dc61bc9e1eabdf8",
  token: "8b2484237c9748ed89f57f413d3de647",
  info: {
    "type": 'net_speed',
    "net_speed": {
      "download": 13658890.786133334,
      "upload": 13658890.786133334
    }
  }
}

const nodeInfoVpn = {
  account_addr: "0xbc3e6c969156de7c90dfedd64dc61bc9e1eabdf8",
  token: "8b2484237c9748ed89f57f413d3de647",
  info: {
    "type": 'vpn',
    "vpn": {
      "status": "down",
      "init_on": 1525726349,
      "ping_on": 1525726349
    }
  }
}

const nodeInfoAlive = {
  account_addr: "0xbc3e6c969156de7c90dfedd64dc61bc9e1eabdf8",
  token: "8b2484237c9748ed89f57f413d3de647",
  info: {
    "type": 'alive',
    "vpn": {
      "status": "up",
      "init_on": 1525726349,
      "ping_on": 1525726349
    }
  }
}

// describe('Route creating account', () => {
//   describe('/POST ' + accountRoute, () => {

//     it('With correct details should return keystore', (done) => {
//       chai.request(server)
//         .post(accountRoute)
//         .send(correctDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(4000)
//   });
// });

// describe('Route for checking balance', () => {
//   describe('/POST ' + balanceRoute, () => {

//     it('With correct wallet address should return balance', (done) => {
//       chai.request(server)
//         .post(balanceRoute)
//         .send(correctDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(10000);
//   });
// });

// describe('route for register user', () => {
//   describe('/POST ' + registerRoute, () => {
//     it('with correct details should return success true', (done) => {
//       chai.request(server)
//         .post(registerRoute)
//         .send(registerUserDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(10000)
//   })
// })

// describe('route for deregister user', () => {
//   describe('/POST ' + deregisterRoute, () => {
//     it('with correct details should return success true', (done) => {
//       chai.request(server)
//         .post(deregisterRoute)
//         .send(correctDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(10000)
//   })
// })

// describe('route for update node-info', () => {
//   describe('/POST ' + updateNodeRoute, () => {
//     it('with correct details should return success true', (done) => {
//       chai.request(server)
//         .post(updateNodeRoute)
//         .send(nodeInfoLocation)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(10000)
//   })
// })

// describe('route for update node-info', () => {
//   describe('/POST ' + updateNodeRoute, () => {
//     it('with correct details should return success true', (done) => {
//       chai.request(server)
//         .post(updateNodeRoute)
//         .send(nodeInfoNetspeed)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(10000)
//   })
// })

// describe('route for update node-info', () => {
//   describe('/POST ' + updateNodeRoute, () => {
//     it('with correct details should return success true', (done) => {
//       chai.request(server)
//         .post(updateNodeRoute)
//         .send(nodeInfoVpn)
//         .end((err, res) => {
//           console.log(err, res.body)
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(10000)
//   })
// })

// describe('route for update node-info', () => {
//   describe('/POST ' + updateNodeRoute, () => {
//     it('with correct details should return success true', (done) => {
//       chai.request(server)
//         .post(updateNodeRoute)
//         .send(nodeInfoAlive)
//         .end((err, res) => {
//           console.log(err, res.body)
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(10000)
//   })
// })