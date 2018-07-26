let {
  gasFee
} = require('./ethScheduler')
let {
  refund
} = require('./refund')

const jobs = () => {
  gasFee()
  refund()
}

module.exports = {
  jobs
}