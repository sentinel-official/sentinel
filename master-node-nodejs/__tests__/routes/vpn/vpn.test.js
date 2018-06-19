import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../../src";

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

const vpnRoute = '/api/client/vpn';
const vpnListRoute = '/api/client/vpn/list';
const payVpnUsage = '/api/client/vpn/pay';
const getVpnUsage = '/api/client/vpn/usage';
const getCurrentUsage = '/api/client/vpn/current';


const correctDetails = {
  account_addr: '0x6b6df9e25f7bf2e363ec1a52a7da4c4a64f5769e'
}

const payVpnUsageDetails = {
  payment_type: 'normal',
  tx_data: '0xf9012c8307a12084773594008307a1209411cb41b3b9387ccfa9cbf71525fa658107d2e3fd80b8c4ac4c60b7000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe6000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe600000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000015af1d78b5000000000000000000000000000000000000000000000000000000005aa260be1ba0856e010080c96d45dad83f93180895d5fa84222ada7bfd5dfcfa9579a5637343a0721a79dcb5cde7f6ff651ff503841f946204cc7169402d45b699d50ca1acd9ea',
  net: 'rinkeby',
  from_addr: '0xd16e64a4083bd4f973df66b75ab266987e509fe6',
  amount: '00',
  session_id: '6c0ae80bae6806e65b488d3a482d9adb',
}

const addVpnUsageDetails = {
  from_addr: '0xd16e64a4083bd4f973df66b75ab266987e509fe6',
  sent_bytes: 10000000000,
  session_duration: '0'
}

describe('Route for get vpn credentials', () => {
  describe('/POST ' + vpnRoute, () => {

    it('With correct details should return message or credentials', (done) => {
      chai.request(server)
        .post(vpnRoute)
        .send(correctDetails)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    }).timeout(10000);
  });
});

describe('Route for get vpns list', () => {
  describe('/GET ' + vpnListRoute, () => {

    it('it should return vpns list if any available', (done) => {
      chai.request(server)
        .get(vpnListRoute)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    }).timeout(5000)
  });
});

describe('Route for get vpn usage', () => {
  describe('/GET ' + getVpnUsage, () => {

    it('it should return the usage of vpns by user', (done) => {
      chai.request(server)
        .post(getVpnUsage)
        .send(correctDetails)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done();
        });
    }).timeout(5000)
  });
});

describe('Route for get vpn usage', () => {
  describe('/GET ' + getVpnUsage, () => {

    it('it should return the usage of vpns by user', (done) => {
      chai.request(server)
        .post(getVpnUsage)
        .send(correctDetails)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done();
        });
    }).timeout(5000)
  });
});

describe('Route for get current usage', () => {
  describe('/GET ' + getCurrentUsage, () => {

    it('it should return the current usage of vpn', (done) => {
      chai.request(server)
        .get(getCurrentUsage)
        .send(correctDetails)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done();
        });
    })
  });
});