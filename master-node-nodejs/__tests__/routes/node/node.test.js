import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../../src";

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

const reportPayment = '/api/client/vpn/report';

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
    download: '',
    upload: '',
  },
  vpn_type: ''
}

const payVpnUsageDetails = {
  payment_type: 'normal',
  tx_data: '0xf9012c8307a12084773594008307a1209411cb41b3b9387ccfa9cbf71525fa658107d2e3fd80b8c4ac4c60b7000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe6000000000000000000000000d16e64a4083bd4f973df66b75ab266987e509fe600000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000015af1d78b5000000000000000000000000000000000000000000000000000000005aa260be1ba0856e010080c96d45dad83f93180895d5fa84222ada7bfd5dfcfa9579a5637343a0721a79dcb5cde7f6ff651ff503841f946204cc7169402d45b699d50ca1acd9ea',
  net: 'rinkeby',
  from_addr: '0xd16e64a4083bd4f973df66b75ab266987e509fe6',
  amount: '00',
  session_id: '6c0ae80bae6806e65b488d3a482d9adb',
}

describe('routes for report payment', () => {
  describe('/POST ' + reportPayment, () => {
    it('should return transaction hash on success', (done) => {
      chai.request(server)
        .post(reportPayment)
        .send(payVpnUsageDetails)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          done()
        })
    }).timeout(10000)
  })
})