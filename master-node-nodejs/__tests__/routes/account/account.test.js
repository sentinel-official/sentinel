import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../../src";

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

const accountRoute = '/api/client/account';
const balanceRoute = '/api/client/account/balance';

const correctDetails = {
  password: 'password',
  account_addr: '0x6b6df9e25f7bf2e363ec1a52a7da4c4a64f5769e'
}

const rawTransactionDetails = {
  tx_data: '0xf86b8209c485098bca5a008252089416f177624d286be280af36800365310f755b4db685e8d4a51000802ca0c8de169581248211f0e678305424798df73910cf4e25720ddb5af80b850c2be2a029c7f1dc9775bc406e6ff44e36a4b4bec04f1c587a96071d83b04812a8c68744',
  net: 'rinkeby'
}


// describe('Route creating account', () => {
//   describe('/POST ' + accountRoute, () => {
//     let wrongDetails = Object.assign({}, correctDetails);

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
//     let wrongDetails = Object.assign({}, correctDetails);

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
