var cp = require('child_process')
let eth = require('./eth/eth');
import { stats } from './jobs/statistics';
import { alive } from './jobs/alive';
import { payments } from './jobs/payments';
import { swaps } from './jobs/swaps';

// var statistics = cp.fork('./src/jobs/statistics.js');
// var alive = cp.fork('./src/jobs/alive.js');
// var payments = cp.fork('./src/jobs/payments.js');

export const app = () => {
  stats('start')
  // statistics.send('start');
  alive({ message: 'start', maxSecs: 60 })
  // alive.send({ message: 'start', maxSecs: 60 })
  payments('start');
  swaps({ message: 'start' })
}