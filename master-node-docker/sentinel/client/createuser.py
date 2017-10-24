"""__doc__"""

import json
from ..utils import get_body


class CreateUser(object):
    """__doc__"""

    def on_post(self, req, resp):
        """__doc__"""
        body = get_body(req)
        password = body['password']
        # web3 operation
        resp.body = json.dumps({'success': True}, ensure_ascii=False)
