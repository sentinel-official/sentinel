// import chai from "chai";
// import chaiHttp from "chai-http";

// import server from "../../../src";

// const expect = chai.expect;
// const should = chai.should();

// chai.use(chaiHttp);

// const accountRoute = '/api/client/account'; //POST
// const balanceRoute = '/api/client/account/balance'; //POST
// const rawTransactionRoute = '/api/client/raw-transaction'; //POST
// const vpnRoute = '/api/client/vpn'; //POST
// const currentVpnRoute = '/api/client/vpn/current'; //POST
// const vpnListRoute = '/api/client/vpn/list'; //GET
// const socksListRoute = '/api/client/vpn/socks-list'; //GET
// const vpnUsageRoute = '/api/client/vpn/usage'; //POST
// const payRoute = '/api/client/vpn/pay'; //POST
// const reportRoute = '/api/client/vpn/report'; //POST
// const connectionRoute = '/api/client/vpn/update-connection'; //POST

// const correctDetails = {
//   password: 'password',
//   account_addr: '0x6b6df9e25f7bf2e363ec1a52a7da4c4a64f5769e'
// }


// const vpnDetails = {
//   account_addr: '0x6b6df9e25f7bf2e363ec1a52a7da4c4a64f5769e',
//   session_name: 'client1521175289919491',
//   vpn_addr: null
// }

// const rawTransactionDetails = {
//   tx_data: '0xf86b8209c485098bca5a008252089416f177624d286be280af36800365310f755b4db685e8d4a51000802ca0c8de169581248211f0e678305424798df73910cf4e25720ddb5af80b850c2be2a029c7f1dc9775bc406e6ff44e36a4b4bec04f1c587a96071d83b04812a8c68744',
//   net: 'rinkeby'
// }

// const payVpnUsageDetails = {
//   payment_type: 'normal',
//   tx_data: '0xf9012c8307a12084773594008307a1209411cb41b3b9387ccfa9cbf71525fa658107d2e3fd80b8c4ac4c60b7000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe6000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe600000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000015af1d78b5000000000000000000000000000000000000000000000000000000005aa260be1ba0856e010080c96d45dad83f93180895d5fa84222ada7bfd5dfcfa9579a5637343a0721a79dcb5cde7f6ff651ff503841f946204cc7169402d45b699d50ca1acd9ea',
//   net: 'rinkeby',
//   from_addr: '0xd16e64a4083bd4f973df66b75ab266987e509fe6',
//   amount: '00',
//   session_id: '6c0ae80bae6806e65b488d3a482d9adb',
// }

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

// describe('Route for raw transaction', () => {
//   describe('/POST ' + rawTransactionRoute, () => {

//     it('With correct wallet address should return balance', (done) => {
//       chai.request(server)
//         .post(rawTransactionRoute)
//         .send(payVpnUsageDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(10000);
//   });
// });

// describe('Route for vpn credentials', () => {
//   describe('/POST ' + vpnRoute, () => {

//     it('With correct details should give credentials', (done) => {
//       chai.request(server)
//         .post(vpnRoute)
//         .send(vpnDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(10000);
//   });
// });

// describe('Route for get current usage', () => {
//   describe('/POST ' + currentVpnRoute, () => {

//     it('it should return the current usage of vpn', (done) => {
//       chai.request(server)
//         .post(currentVpnRoute)
//         .send(correctDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done();
//         });
//     })
//   });
// });

// describe('Route for get vpns list', () => {
//   describe('/GET ' + vpnListRoute, () => {

//     it('it should return vpns list if any available', (done) => {
//       chai.request(server)
//         .get(vpnListRoute)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(5000)
//   });
// });

// describe('routes for socks list', () => {
//   describe('/GET ' + socksListRoute, () => {
//     it('should return socks list', (done) => {
//       chai.request(server)
//         .get(socksListRoute)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     })
//   })
// })

// describe('Route for get vpn usage', () => {
//   describe('/POST ' + vpnUsageRoute, () => {

//     it('it should return the usage of vpns by user', (done) => {
//       chai.request(server)
//         .post(vpnUsageRoute)
//         .send(correctDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done();
//         });
//     }).timeout(5000)
//   });
// });

// describe('routes for pay vpn session', () => {
//   describe('/POST ' + payRoute, () => {
//     it('should return transaction hashes on success', (done) => {
//       chai.request(server)
//         .post(payRoute)
//         .send(payVpnUsageDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(20000)
//   })
// })

// describe('routes for report payment', () => {
//   describe('/POST ' + reportRoute, () => {
//     it('should return transaction hash on success', (done) => {
//       chai.request(server)
//         .post(reportRoute)
//         .send(payVpnUsageDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(10000)
//   })
// })