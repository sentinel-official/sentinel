import Raven from 'raven'

function Logger() {
  this.client = Raven.config('https://ac48b26109634081b947150ce8df3def:e9c96b8380e04b5abca55f67ea07af5c@sentry.io/535069').install()
}

Logger.prototype.sendLog = function (message, resp) {
  this.client.captureException()
  resp.status = 200;
  resp.body = message;
}

Logger.prototype.sendException = function () {
  this.client.captureException()
}

module.exports.logger = new Logger()