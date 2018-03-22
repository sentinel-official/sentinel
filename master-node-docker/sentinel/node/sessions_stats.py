import json
import datetime
import falcon
from ..db import db

class GetDailySessionCount(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.connections.aggregate([{
            "$project": {
                "total": {
                    "$add": [
                        datetime.datetime(1970, 1, 1), {
                            "$multiply": ["$start_time", 1000]
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
                "sessionsCount": {
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

class GetActiveSessionCount(object):
    def on_get(self,req,resp):
        count=db.connections.find({"end_time":None}).count()
        message={'success':True,'count':count}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)