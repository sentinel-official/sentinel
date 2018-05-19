# coding=utf-8
import datetime
import json
import time

import falcon

from ..db import db


class GetDailyDataCount(object):
    def on_get(self, req, resp):
        daily_count = []
        output = db.connections.find({'server_usage': {'$exists': True}})

        result = db.connections.aggregate([{
            '$project': {
                'total': {
                    '$add': [
                        datetime.datetime(1970, 1, 1), {
                            '$multiply': ['$start_time', 1000]
                        }
                    ]
                },
                'data': '$server_usage.down'
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

        message = {'success': True, 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetTotalDataCount(object):
    def on_get(self, req, resp):
        total_count = []
        result = db.connections.aggregate([{
            '$group': {
                '_id': None,
                'Total': {
                    '$sum': '$server_usage.down'
                }
            }
        }])
        for doc in result:
            total_count.append(doc)

        message = {'success': True, 'stats': total_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetLastDataCount(object):
    def on_get(self, req, resp):
        total_count = []
        result = db.connections.aggregate([{
            '$match': {
                'start_time': {
                    '$gte': time.time() - (24 * 60 * 60)
                }
            }
        }, {
            '$group': {
                '_id': None,
                'Total': {
                    '$sum': '$server_usage.down'
                }
            }
        }])

        for doc in result:
            total_count.append(doc)

        message = {'success': True, 'stats': total_count}

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

        message = {'success': True, 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetTotalNodeCount(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.statistics.aggregate([{
            '$project': {
                'total': {
                    '$add': [
                        datetime.datetime(1970, 1, 1), {
                            '$multiply': ['$timestamp', 1000]
                        }
                    ]
                },
                'nodes': '$nodes.total'
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
                    '$sum': '$nodes'
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }])

        for doc in result:
            daily_count.append(doc)

        message = {'success': True, 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyActiveNodeCount(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.statistics.aggregate([{
            '$project': {
                'total': {
                    '$add': [
                        datetime.datetime(1970, 1, 1), {
                            '$multiply': ['$timestamp', 1000]
                        }
                    ]
                },
                'nodes': '$nodes.up'
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
                    '$sum': '$nodes'
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }])

        for doc in result:
            daily_count.append(doc)

        message = {'success': True, 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyPaidSentsCount(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.statistics.aggregate([{
            '$project': {
                'total': {
                    '$add': [
                        datetime.datetime(1970, 1, 1), {
                            '$multiply': ['$timestamp', 1000]
                        }
                    ]
                },
                'amount': '$paid_count'
            }
        }, {
            '$group': {
                '_id': {
                    '$dateToString': {
                        'format': '%d/%m/%Y',
                        'date': '$total'
                    }
                },
                'sentsCount': {
                    '$sum': '$amount'
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }])

        for doc in result:
            daily_count.append(doc)

        message = {'success': True, 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAveragePaidSentsCount(object):
    def on_get(self, req, resp):
        avg_count = []

        result = db.payments.aggregate([{'$group':{'_id':0,'AverageCount':{'$avg':'$paid_count'}}}])

        for doc in result:
            avg_count.append(doc)

        message = {'success': True, 'average': avg_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)

class GetAverageTotalSentsCount(object):
    def on_get(self, req, resp):
        avg_count = []

        result = db.payments.aggregate([
            {'$project':{
                'total':{'$add':['$paid_count','$unpaid_count']}
                }
            },{
                '$group':{'_id':0,'Avg':{'$avg':'$total'}}}
            ])

        for doc in result:
            avg_count.append(doc)

        message = {'success': True, 'average': avg_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyTotalSentsUsed(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.statistics.aggregate([{
            '$project': {
                'total': {
                    '$add': [
                        datetime.datetime(1970, 1, 1), {
                            '$multiply': ['$timestamp', 1000]
                        }
                    ]
                },
                'amount': {
                    '$add': ['$paid_count', '$unpaid_count']
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
                'sentsCount': {
                    '$sum': '$amount'
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }])

        for doc in result:
            daily_count.append(doc)

        message = {'success': True, 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAverageNodesCount(object):
    def on_get(self, req, resp):
        avg_count = []

        result = db.nodes.aggregate([{
            '$group': {
                '_id': None,
                'olddate': {
                    '$min': "$joined_on"
                },
                'newdate': {
                    '$max': "$joined_on"
                },
                "SUM": {
                    '$sum': 1
                }
            }
        }, {
            '$project': {
                '_id': 0,
                'Average': {
                    '$divide': [
                        "$SUM", {
                            '$divide': [{
                                "$subtract": ["$newdate", "$olddate"]
                            }, 24 * 60 * 60]
                        }
                    ]
                }
            }
        }])

        for doc in result:
            avg_count.append(doc)

        message = {'success': True, 'average': avg_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetActiveNodeCount(object):
    def on_get(self, req, resp):
        count = db.nodes.find({'vpn.status': 'up'}).count()
        message = {'success': True, 'count': count}

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

        message = {'success': True, 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAverageSessionsCount(object):
    def on_get(self, req, resp):
        avg_count = []

        result = db.connections.aggregate([{
            '$group': {
                '_id': None,
                'olddate': {
                    '$min': "$start_time"
                },
                'newdate': {
                    '$max': "$start_time"
                },
                "SUM": {
                    '$sum': 1
                }
            }
        }, {
            '$project': {
                '_id': 0,
                'Average Sessions': {
                    '$divide': [
                        "$SUM", {
                            '$divide': [{
                                "$subtract": ["$newdate", "$olddate"]
                            }, 24 * 60 * 60]
                        }
                    ]
                }
            }
        }])

        for doc in result:
            avg_count.append(doc)

        message = {'success': True, 'average': avg_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetActiveSessionCount(object):
    def on_get(self, req, resp):
        count = db.connections.find({'end_time': None}).count()
        message = {'success': True, 'count': count}

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
                    },
                              int(time.time()), '$end_time']
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

        message = {'success': True, 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyAverageDuration(object):
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
                'Sum': {
                    '$sum': {
                        '$subtract': [{
                            '$cond': [{
                                '$eq': ['$end_time', None]
                            },
                                      int(time.time()), '$end_time']
                        }, '$start_time']
                    }
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
                'Average': {
                    '$avg': '$Sum'
                }
            }
        }, {
            '$sort': {
                '_id': 1
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
            '$project': {
                'Sum': {
                    '$sum': {
                        '$subtract': [{
                            '$cond': [{
                                '$eq': ['$end_time', None]
                            },
                                      int(time.time()), '$end_time']
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

        message = {'success': True, 'average': avg_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetLastAverageDuration(object):
    def on_get(self, req, resp):
        avg_count = []
        result = db.connections.aggregate([{
            '$match': {
                'start_time': {
                    '$gte': time.time() - (24 * 60 * 60)
                }
            }
        }, {
            '$project': {
                'Sum': {
                    '$sum': {
                        '$subtract': [{
                            '$cond': [{
                                '$eq': ['$end_time', None]
                            },
                                      int(time.time()), '$end_time']
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

        message = {'success': True, 'average': avg_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetNodeStatistics(object):
    def on_get(self, req, resp):
        account_addr = str(req.get_param('addr'))

        result = db.connections.aggregate([{
            '$match': {
                'vpn_addr': account_addr
            }
        }, {
            '$group': {
                '_id': '$vpn_addr',
                'sessions_count': {
                    '$sum': 1
                },
                'active_sessions': {
                    '$sum': {
                        '$cond': [{
                            '$or': [{
                                '$eq': ['$end_time', None]
                            }, {
                                '$eq': ['$end_time', None]
                            }]
                        }, 1, 0]
                    }
                },
                'download': {
                    '$sum': '$server_usage.down'
                },
                'upload': {
                    '$sum': '$server_usage.up'
                }
            }
        }])
        message = {'success': True, 'result': list(result)}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
