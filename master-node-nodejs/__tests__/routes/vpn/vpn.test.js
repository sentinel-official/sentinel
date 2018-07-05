// import chai from "chai";
// import chaiHttp from "chai-http";

// import server from "../../../src";

// const expect = chai.expect;
// const should = chai.should();

// chai.use(chaiHttp);

// const vpnRoute = '/api/client/vpn';
// const vpnListRoute = '/api/client/vpn/list';
// const payVpnUsage = '/api/client/vpn/pay';
// const getVpnUsage = '/api/client/vpn/usage';
// const getCurrentUsage = '/api/client/vpn/current';
// const rawTransaction = '/api/client/raw-transaction';
// const getSocksList = '/api/client/vpn/socks-list';
// const reportPayment = '/api/client/vpn/report';


// const correctDetails = {
//   account_addr: '0x6b6df9e25f7bf2e363ec1a52a7da4c4a64f5769e',
//   session_name: 'client1521175289919491',
//   vpn_addr: null
// }

// const payVpnUsageDetails = {
//   payment_type: 'normal',
//   tx_data: '0xf9012c8307a12084773594008307a1209411cb41b3b9387ccfa9cbf71525fa658107d2e3fd80b8c4ac4c60b7000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe6000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe600000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000015af1d78b5000000000000000000000000000000000000000000000000000000005aa260be1ba0856e010080c96d45dad83f93180895d5fa84222ada7bfd5dfcfa9579a5637343a0721a79dcb5cde7f6ff651ff503841f946204cc7169402d45b699d50ca1acd9ea',
//   net: 'rinkeby',
//   from_addr: '0xd16e64a4083bd4f973df66b75ab266987e509fe6',
//   amount: '00',
//   session_id: '6c0ae80bae6806e65b488d3a482d9adb',
// }

// describe('Route for get vpn credentials', () => {
//   describe('/POST ' + vpnRoute, () => {

//     it('With correct details should return message or credentials', (done) => {
//       chai.request(server)
//         .post(vpnRoute)
//         .send(correctDetails)
//         .end((err, res) => {
//           // res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000);
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

// describe('Route for get vpn usage', () => {
//   describe('/POST ' + getVpnUsage, () => {

//     it('it should return the usage of vpns by user', (done) => {
//       chai.request(server)
//         .post(getVpnUsage)
//         .send(correctDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done();
//         });
//     }).timeout(5000)
//   });
// });

// describe('Route for get current usage', () => {
//   describe('/POST ' + getCurrentUsage, () => {

//     it('it should return the current usage of vpn', (done) => {
//       chai.request(server)
//         .post(getCurrentUsage)
//         .send(correctDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done();
//         });
//     })
//   });
// });

// describe('route for raw transaction', () => {
//   describe('/POST ' + rawTransaction, () => {
//     it('should return transaction hash on success', (done) => {
//       chai.request(server)
//         .post(rawTransaction)
//         .send(payVpnUsageDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(5000)
//   })
// })

// describe('routes for socks list', () => {
//   describe('/GET ' + getSocksList, () => {
//     it('should return socks list', (done) => {
//       chai.request(server)
//         .get(getSocksList)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     })
//   })
// })

// describe('routes for pay vpn session', () => {
//   describe('/POST ' + payVpnUsage, () => {
//     it('should return transaction hashes on success', (done) => {
//       chai.request(server)
//         .post(payVpnUsage)
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
//   describe('/POST ' + reportPayment, () => {
//     it('should return transaction hash on success', (done) => {
//       chai.request(server)
//         .post(reportPayment)
//         .send(payVpnUsageDetails)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.have.property('success').eql(true);
//           done()
//         })
//     }).timeout(10000)
//   })
// })