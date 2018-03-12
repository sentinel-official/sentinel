import json
from .utils import pp


class JSONTranslator(object):
    def process_request(self, req, resp):
        body = req.stream.read()
        try:
            req.body = json.loads(body.decode('utf-8'))
        except ValueError:
            _ = {
                'message': 'Malformed JSON',
                'errors': ['JSON was incorrect or not encoded as UTF-8.']
            }
