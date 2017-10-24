"""__doc__"""

import json
from ..db import db
from ..utils import get_body


class SendState(object):
    """__doc__"""

    def on_post(self, req, resp):
        """__doc__"""
        body = get_body(req)
        ip = body['ip']
        is_active = body['is_active']
        account_addr = body['account_addr']
        node_info = db.nodes.find_one(
            {'account_addr': account_addr, 'ip.ip': ip['ip']})
        if node_info is None:
            resp.body = json.dumps({'success': False}, ensure_ascii=False)
        else:
            result = db.nodes.update({'account_addr': account_addr, 'ip.ip': ip['ip']},
                                     {'$set': {'is_active': is_active}})
            if result['updatedExisting']:
                resp.body = json.dumps({'success': True}, ensure_ascii=False)
            else:
                resp.body = json.dumps({'success': False}, ensure_ascii=False)
