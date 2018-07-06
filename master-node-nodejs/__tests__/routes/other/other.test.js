import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../../src";

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

const logErrorRoute = '/api/logs/error'
const logErrorDetails = {
  "os": "win32x64",
  "account_addr": "0xcb32c7e2c1fb4335d5450c9d172cde05e7b126bc",
  "error_str": "{\"killed\":false,\"code\":1,\"signal\":null,\"cmd\":\"ping -n 2 185.186.77.103 | findstr /i \\\"average\\\"\"}",
  "log_type": "error"
}

describe('Route for log error route', () => {
  describe('/POST' + logErrorRoute, () => {

    it('return success status on success', (done) =>{
      chai.request(server)
      .post(logErrorRoute)
      .send(logErrorDetails)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done()
      })
    }).timeout(20000)
  })
})