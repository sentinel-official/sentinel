"""__doc__"""

import json
from ..db import db
from ..utils import get_body


class GetVPNCreds(object):
    """__doc__"""

    def on_post(self, req, resp):
        """__doc__"""
        body = get_body(req)
        account_addr = body['account_addr']
        # account validation
        node_info = db.nodes.find_one({'is_active': False})
        if node_info is None:
            resp.body = json.dumps(
                {'success': False, 'message': 'All VPN Servers are busy.'}, ensure_ascii=False)
        else:
            ovpn = node_info['ovpn']
            resp.body = json.dumps(
                {'success': True, 'ovpn': ovpn}, ensure_ascii=False)
