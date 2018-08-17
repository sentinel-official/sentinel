import Raven from 'raven'

class Logger {
  constructor() {
    this.client = Raven.config('https://ac48b26109634081b947150ce8df3def:e9c96b8380e04b5abca55f67ea07af5c@sentry.io/535069').install();
  }
  sendLog(message, resp) {
    this.client.captureException();
    resp.status = 200;
    resp.body = message;
  }
  sendException() {
    this.client.captureException();
  }
}

export const logger = new Logger();