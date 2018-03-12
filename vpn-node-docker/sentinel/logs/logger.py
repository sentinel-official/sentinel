from raven import Client
import falcon
import json


class Logger(object):
    def __init__(self):
        self.client = Client(
            'https://8ca6ecca5c2c4f3fa8af79d29eea2fc0:0c19293e12494cda823ae530148b9824@sentry.io/300868')

    def send_log(self, message, resp):
        self.client.captureException()
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)

    def send_exception(self):
        self.client.captureException()


logger = Logger()
