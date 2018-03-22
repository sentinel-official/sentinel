import json
import datetime
import falcon
from ..db import db

class GetDailyNodeCount(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.nodes.aggregate([{
            "$project": {
                "total": {
                    "$add": [
                        datetime.datetime(1970, 1, 1), {
                            "$multiply": ["$created_at", 1000]
                        }
                    ]
                }
            }
        }, {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%d/%m/%Y",
                        "date": '$total'
                    }
                },
                "nodesCount": {
                    "$sum": 1
                }
            }
        }, {
            "$sort": {
                "_id": 1
            }
        }])
        for doc in result:
            daily_count.append(doc)

        message = {'success': True, 'stats': daily_count}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetActiveNodeCount(object):
    def on_get(self, req, resp):
        count = db.nodes.find({"vpn.status": "up"}).count()
        message = {'success': True, 'count': count}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)