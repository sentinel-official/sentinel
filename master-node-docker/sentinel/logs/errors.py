import json

import falcon

from ..db import db


class LogTheError(object):
    def on_post(self, req, resp):
        os = str(req.body['os']).lower()
        account_addr = str(req.body['account_addr']).lower()
        error_str = str(req.body['error_str']).lower()
        log_type = 'error'

        _ = db.logs.insert_one({
            'os': os,
            'account_addr': account_addr,
            'error_str': error_str,
            'log_type': log_type
        })

        message = {
            'success': True,
            'message': 'Error reported successfully.'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
