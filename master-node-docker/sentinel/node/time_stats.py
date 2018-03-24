import json
import datetime
import time
import falcon
from ..db import db


class GetDailyDurationCount(object):
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
                },
                "start": "$start_time",
                "end": {
                    "$cond": [{
                        "$eq": ["$end_time", None]
                    },
                              int(time.time()), "$end_time"]
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
                "durationCount": {
                    "$sum": {
                        "$subtract": ["$end", "$start"]
                    }
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


class GetAverageDuration(object):
    def on_get(self, req, resp):
        avg_count = []
        result = db.connections.aggregate([{
            "$project": {
                "Sum": {
                    "$sum": {
                        "$subtract": [{
                            "$cond": [{
                                "$eq": ["$end_time", None]
                            },
                                      int(time.time()), "$end_time"]
                        }, "$start_time"]
                    }
                }
            }
        }, {
            "$group": {
                "_id": None,
                "Average": {
                    "$avg": "$Sum"
                }
            }
        }])

        for doc in result:
            avg_count.append(doc)

        message = {'success': True, 'average': avg_count}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
