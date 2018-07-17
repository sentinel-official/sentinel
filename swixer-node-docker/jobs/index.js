let { refund } = require('./refund')
let { timeoutResend } = require('./timeout.resend')
let { depositTimeout } = require('./deposit.timeout')

const jobs = () => {
  refund();
  timeoutResend();
  depositTimeout();
}

module.exports = {
  jobs
}