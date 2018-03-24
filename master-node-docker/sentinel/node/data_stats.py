import json
import datetime
import falcon
from ..db import db

class GetDailyDataCount(object):
    def on_get(self, req, resp):
        daily_count = []
        output=db.connections.find({"usage":{"$exists":True}})
        for data in output:
            data['usage']['up']=int(data['usage']['up'])
            data['usage']['down']=int(data['usage']['down'])
            db.connections.save(data)
        
        result = db.connections.aggregate([{
            "$project": {
                "total": {
                    "$add": [
                        datetime.datetime(1970, 1, 1), {
                            "$multiply": ["$start_time", 1000]
                        }
                    ]
                },
                "data":"$usage.down"
            }
        }, {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%d/%m/%Y",
                        "date": '$total'
                    }
                },
                "dataCount": {
                    "$sum": "$data"
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


class GetTotalDataCount(object):
    def on_get(self,req,resp):
        total_count=[]
        result=db.connections.aggregate([{"$group":{"_id":None,"Total":{"$sum":"$usage.down"}}}])
        for doc in result:
            total_count.append(doc)

        message = {'success': True, 'stats': total_count}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)