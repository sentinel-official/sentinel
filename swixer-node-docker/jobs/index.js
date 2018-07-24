let {
  gasFee
} = require('./ethScheduler')

const jobs = () => {
  gasFee()
}

module.exports = {
  jobs
}