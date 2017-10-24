"""__doc__"""

import falcon
from sentinel.node import SendInfo
from sentinel.node import SendState
from sentinel.client import CreateUser
from sentinel.client import GetVPNCreds


app = falcon.API()
app.add_route('/sendinfo', SendInfo())
app.add_route('/sendstate', SendState())
app.add_route('/createuser', CreateUser())
app.add_route('/getvpncreds', GetVPNCreds())

