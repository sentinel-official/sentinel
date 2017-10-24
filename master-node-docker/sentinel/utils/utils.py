"""__doc__"""

import json
import pprint


pp = pprint.PrettyPrinter(indent=4)


def get_body(req):
    """__doc__"""
    body = req.stream.read()
    body = json.loads(body.decode('utf-8'))
    return body
