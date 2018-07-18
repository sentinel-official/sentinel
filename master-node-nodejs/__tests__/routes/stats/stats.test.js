// import chai from "chai";
// import chaiHttp from "chai-http";

// import server from "../../../src";

// const expect = chai.expect;
// const should = chai.should();

// chai.use(chaiHttp);

// const dailySessionStats = '/api/stats/sessions/daily-stats'
// const activeSessionsCount = '/api/stats/sessions/active-count'
// const averageSessionsStats = '/api/stats/sessions/average-count'
// const totalNodes = '/api/stats/nodes/total-nodes'
// const dailyActiveNodes = '/api/stats/nodes/daily-active'
// const dailyAverageNodes = '/api/stats/nodes/average-nodes'
// const dailyNodeStats = '/api/stats/nodes/daily-stats'
// const activeNodeCount = '/api/stats/nodes/active-count'
// const dailyDataStats = '/api/stats/data/daily-stats'
// const totalData = '/api/stats/data/total-data'
// const lastDayData = '/api/stats/data/last-data'
// const dailyTimeStats = '/api/stats/time/daily-stats'
// const averageDuration = '/api/stats/time/average-duration'
// const averageDailyDuration = '/api/stats/time/average-daily'
// const paidSentsCount = '/api/stats/payment/paid-sents-count'
// const totalSentsUsed = '/api/stats/payment/total-sents-used'
// const averagePaidSents = '/api/stats/payment/average-paid-sents'
// const averageTotalSents = '/api/stats/payment/average-total-sents'
// const nodeStats = '/api/stats/node'

// describe('Route for get daily session statistics', () => {
//   describe('/GET ' + dailySessionStats, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(dailySessionStats)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get active sessions count', () => {
//   describe('/GET ' + activeSessionsCount, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(activeSessionsCount)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(25000)
//   });
// });

// describe('Route for get average sessions stats', () => {
//   describe('/GET ' + averageSessionsStats, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(averageSessionsStats)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get total nodes', () => {
//   describe('/GET ' + totalNodes, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(totalNodes)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get total active nodes', () => {
//   describe('/GET ' + dailyActiveNodes, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(dailyActiveNodes)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get daily average nodes', () => {
//   describe('/GET ' + dailyAverageNodes, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(dailyAverageNodes)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get daily node stats', () => {
//   describe('/GET ' + dailyNodeStats, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(dailyNodeStats)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });


// describe('Route for get active node count', () => {
//   describe('/GET ' + activeNodeCount, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(activeNodeCount)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get daily data stats', () => {
//   describe('/GET ' + dailyDataStats, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(dailyDataStats)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get total data used', () => {
//   describe('/GET ' + totalData, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(totalData)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get last day data stats', () => {
//   describe('/GET ' + lastDayData, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(lastDayData)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get daily time stats', () => {
//   describe('/GET ' + dailyTimeStats, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(dailyTimeStats)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(25000)
//   });
// });

// describe('Route for get average duration stats', () => {
//   describe('/GET ' + averageDuration, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(averageDuration)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get average daily duration stats', () => {
//   describe('/GET ' + averageDailyDuration, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(averageDailyDuration)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get daily paid sents', () => {
//   describe('/GET ' + paidSentsCount, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(paidSentsCount)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get total sents used', () => {
//   describe('/GET ' + totalSentsUsed, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(totalSentsUsed)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get average sents paid', () => {
//   describe('/GET ' + averagePaidSents, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(averagePaidSents)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get average sents paid', () => {
//   describe('/GET ' + averagePaidSents, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(averagePaidSents)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });

// describe('Route for get average total sents', () => {
//   describe('/GET ' + averageTotalSents, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(averageTotalSents)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });


// describe('Route for get node stats', () => {
//   describe('/GET ' + nodeStats, () => {

//     it('it should return stats', (done) => {
//       chai.request(server)
//         .get(nodeStats)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           done();
//         });
//     }).timeout(20000)
//   });
// });
