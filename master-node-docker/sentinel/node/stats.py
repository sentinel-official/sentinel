# coding=utf-8
import datetime
import json
import time

import falcon

from ..db import db


class GetDailyDataCount(object):
    def on_get(self, req, resp):
        daily_count = []
        output = db.connections.find({
            'usage': {
                '$exists': True
            }
        })
        for data in output:
            if (type(data['usage']['up']) is not int) or (type(data['usage']['down']) is not int):
                data['usage']['up'] = int(data['usage']['up'])
                data['usage']['down'] = int(data['usage']['down'])
                db.connections.save(data)

        result = db.connections.aggregate([{
            '$project': {
                'total': {
                    '$add': [
                        datetime.datetime(1970, 1, 1), {
                            '$multiply': ['$start_time', 1000]
                        }
                    ]
                },
                'data': '$usage.down'
            }
        }, {
            '$group': {
                '_id': {
                    '$dateToString': {
                        'format': '%d/%m/%Y',
                        'date': '$total'
                    }
                },
                'dataCount': {
                    '$sum': '$data'
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }])

        for doc in result:
            daily_count.append(doc)

        message = {
            'success': True,
            'stats': daily_count
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetTotalDataCount(object):
    def on_get(self, req, resp):
        total_count = []
        result = db.connections.aggregate([{
            '$group': {
                '_id': None,
                'Total': {
                    '$sum': '$usage.down'
                }
            }
        }])
        for doc in result:
            total_count.append(doc)

        message = {
            'success': True,
            'stats': total_count
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyNodeCount(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.nodes.aggregate([{
            '$project': {
                'total': {
                    '$add': [
                        datetime.datetime(1970, 1, 1), {
                            '$multiply': ['$joined_on', 1000]
                        }
                    ]
                }
            }
        }, {
            '$group': {
                '_id': {
                    '$dateToString': {
                        'format': '%d/%m/%Y',
                        'date': '$total'
                    }
                },
                'nodesCount': {
                    '$sum': 1
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }])
        for doc in result:
            daily_count.append(doc)

        message = {
            'success': True,
            'stats': daily_count
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetActiveNodeCount(object):
    def on_get(self, req, resp):
        count = db.nodes.find({
            'vpn.status': 'up'
        }).count()
        message = {
            'success': True,
            'count': count
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailySessionCount(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.connections.aggregate([{
            '$project': {
                'total': {
                    '$add': [
                        datetime.datetime(1970, 1, 1), {
                            '$multiply': ['$start_time', 1000]
                        }
                    ]
                }
            }
        }, {
            '$group': {
                '_id': {
                    '$dateToString': {
                        'format': '%d/%m/%Y',
                        'date': '$total'
                    }
                },
                'sessionsCount': {
                    '$sum': 1
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }])
        for doc in result:
            daily_count.append(doc)

        message = {
            'success': True,
            'stats': daily_count
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetActiveSessionCount(object):
    def on_get(self, req, resp):
        count = db.connections.find({
            'end_time': None
        }).count()
        message = {
            'success': True,
            'count': count
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyDurationCount(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.connections.aggregate([{
            '$project': {
                'total': {
                    '$add': [
                        datetime.datetime(1970, 1, 1), {
                            '$multiply': ['$start_time', 1000]
                        }
                    ]
                },
                'start': '$start_time',
                'end': {
                    '$cond': [{
                        '$eq': ['$end_time', None]
                    }, int(time.time()), '$end_time']
                }
            }
        }, {
            '$group': {
                '_id': {
                    '$dateToString': {
                        'format': '%d/%m/%Y',
                        'date': '$total'
                    }
                },
                'durationCount': {
                    '$sum': {
                        '$subtract': ['$end', '$start']
                    }
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }])
        for doc in result:
            daily_count.append(doc)

        message = {
            'success': True,
            'stats': daily_count
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAverageDuration(object):
    def on_get(self, req, resp):
        avg_count = []
        result = db.connections.aggregate([{
            '$project': {
                'Sum': {
                    '$sum': {
                        '$subtract': [{
                            '$cond': [{
                                '$eq': ['$end_time', None]
                            }, int(time.time()), '$end_time']
                        }, '$start_time']
                    }
                }
            }
        }, {
            '$group': {
                '_id': None,
                'Average': {
                    '$avg': '$Sum'
                }
            }
        }])

        for doc in result:
            avg_count.append(doc)

        message = {
            'success': True,
            'average': avg_count
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetNodeStatistics(object):
    def on_get(self, req, resp):
        account_addr = str(req.get_param('addr'))

        result = db.connections.aggregate([
            {
                '$match': {
                    'account_addr': account_addr
                }
            }, {
                '$group': {
                    '_id': '$account_addr',
                    'sessions_count': {
                        '$sum': 1
                    },
                    'active_sessions': {
                        '$sum': {
                            '$cond': [
                                {
                                    '$or': [
                                        {
                                            '$eq': ['$end_time', None]
                                        }, {
                                            '$eq': ['$end_time', None]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        }
                    },
                    'download': {
                        '$sum': '$usage.down'
                    },
                    'upload': {
                        '$sum': '$usage.up'
                    }
                }
            }
        ])
        message = {
            'success': True,
            'result': list(result)
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
