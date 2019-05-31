# coding=utf-8
import datetime
import json
import time

import falcon

from ..db import db


def getAverageNodeCount():
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
            'average': {
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

    message = {'success': True, 'average': avg_count[0]['average']}

    return message


def getAverageActiveNodeCount():
    avg_count = []

    result = db.statistics.aggregate([{'$group': {'_id': 0, 'average': {'$avg': '$nodes.up'}}}])

    for doc in result:
        avg_count.append(doc)

    message = {'success': True, 'average': avg_count[0]['average']}

    return message


def getActiveNodeCount():
    count = db.nodes.find({'vpn.status': 'up'}).count()
    message = {'success': True, 'count': count}
    return message


def getDailyAverageDuration():
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
                    'format': '%Y/%m/%d',
                    'date': '$total'
                }
            },
            'average': {
                '$avg': '$Sum'
            }
        }
    }, {
        '$sort': {
            '_id': 1
        }
    }])

    for doc in result:
        doc['average'] = doc['average'] / 60
        daily_count.append(doc)

    message = {'success': True, 'units': 'minutes', 'stats': daily_count}
    return message


def getLastAverageDuration():
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
            'average': {
                '$avg': '$Sum'
            }
        }
    }])

    for doc in result:
        doc['average'] = doc['average'] / 60
        avg_count.append(doc)

    message = {'success': True, 'units': 'minutes', 'average': avg_count[0]['average']}
    return message


class GetDailyDataCount(object):
    def on_get(self, req, resp):
        interval = req.get_param('interval')
        if interval is not None:
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
                    'data': '$server_usage.down'
                }
            }, {
                '$group': {
                    '_id': {
                        '$dateToString': {
                            'format': '%Y/%m/%d',
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
                doc['dataCount'] = doc['dataCount'] / (1024 * 1024)
                daily_count.append(doc)

            message = {'success': True, 'units': 'MB', 'stats': daily_count}

        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetTotalDataCount(object):
    def on_get(self, req, resp):
        _format = req.get_param('format')
        if _format is not None:
            total_count = []
            result = db.connections.aggregate([{
                '$group': {
                    '_id': None,
                    'total': {
                        '$sum': '$server_usage.down'
                    }
                }
            }])
            for doc in result:
                doc['total'] = doc['total'] / (1024 * 1024)
                total_count.append(doc)

            message = {'success': True, 'units': 'MB', 'stats': total_count[0]['total']}

        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetLastDataCount(object):
    def on_get(self, req, resp):
        _filter = req.get_param('filter')
        _format = req.get_param('format')
        if _filter is not None and _format is not None:
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
                    'total': {
                        '$sum': '$server_usage.down'
                    }
                }
            }])

            for doc in result:
                doc['total'] = doc['total'] / (1024 * 1024)
                total_count.append(doc)

            message = {'success': True, 'units': 'MB', 'stats': total_count[0]['total']}

        else:
            message = {'success': False, 'message': 'No params found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyNodeCount(object):
    def on_get(self, req, resp):
        interval = req.get_param('interval')
        if interval is not None:
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
                            'format': '%Y/%m/%d',
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

        else:
            message = {'success': False, 'message': 'No param found'}

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
                        'format': '%Y/%m/%d',
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
        interval = req.get_param('interval')
        _format = req.get_param('format')
        if interval is not None and _format is None:
            if interval == 'current':
                message = getActiveNodeCount()
            else:
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
                                'format': '%Y/%m/%d',
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

        elif interval is not None and format is not None:
            message = getAverageActiveNodeCount()
        else:
            message = {'success': False, 'message': 'No params found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyPaidSentsCount(object):
    def on_get(self, req, resp):
        daily_count = []
        result = db.payments.aggregate([{
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
                        'format': '%Y/%m/%d',
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

        message = {'success': True, 'units': 'SENT', 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAveragePaidSentsCount(object):
    def on_get(self, req, resp):
        _format = req.get_param('format')
        if _format is not None:
            avg_count = []

            result = db.payments.aggregate([{'$group': {'_id': 0, 'averageCount': {'$avg': '$paid_count'}}}])

            for doc in result:
                avg_count.append(doc)

            message = {'success': True, 'units': 'SENT', 'average': avg_count[0]['averageCount']}
        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAverageTotalSentsCount(object):
    def on_get(self, req, resp):
        interval = req.get_param('interval')
        if interval is not None:
            avg_count = []

            result = db.payments.aggregate([
                {'$project': {
                    'total': {'$add': ['$paid_count', '$unpaid_count']}
                }
                }, {
                    '$group': {'_id': 0, 'average': {'$avg': '$total'}}}
            ])

            for doc in result:
                avg_count.append(doc)

            message = {'success': True, 'units': 'SENT', 'average': avg_count[0]['average']}
        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyTotalSentsUsed(object):
    def on_get(self, req, resp):
        interval = req.get_param('interval')
        if interval is not None:
            daily_count = []
            result = db.payments.aggregate([{
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
                            'format': '%Y/%m/%d',
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

            message = {'success': True, 'units': 'SENT', 'stats': daily_count}
        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailySessionCount(object):
    def on_get(self, req, resp):
        interval = req.get_param('interval')
        if interval is not None:
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
                            'format': '%Y/%m/%d',
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

        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAverageSessionsCount(object):
    def on_get(self, req, resp):
        interval = req.get_param('interval')
        _format = req.get_param('format')
        if interval is not None and _format is not None:
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
                    'averageSessions': {
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

            message = {'success': True, 'average': avg_count[0]['averageSessions']}

        else:
            message = {'success': False, 'message': 'No params Found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetActiveSessionCount(object):
    def on_get(self, req, resp):
        _filter = req.get_param('filter')
        _format = req.get_param('format')
        if _filter is not None and _format is not None:
            count = db.connections.find({'end_time': None}).count()
            message = {'success': True, 'count': count}

        else:
            message = {'success': False, 'message': 'No params found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetTotalSessionsCount(object):
    def on_get(self, req, resp):
        count = db.connections.count()
        message = {'success': True, 'count': count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetLatestSessions(object):
    def on_get(self, req, resp):
        stats = []
        result = db.connections.aggregate([{
            "$sort":{
                "start_time":-1
            }},{
                "$limit":5
            },{
                "$project":{
                    "_id": False,
                    "duration":{
                        "$subtract":[{"$cond":[{"$eq":["$end_time",None]},int(time.time()),"$end_time"]},"$start_time"]
                    },
                    "data_transferred":"$server_usage.down",
                    "status":{"$cond":[{"$eq":["$end_time",None]},True,False]}
                }
            }
        ])

        for doc in result:
            doc['data_transferred'] = doc['data_transferred'] / (1024 * 1024)
            doc['duration'] = doc['duration'] / 60
            stats.append(doc)

        message = {'success': True, 'data_transferred_units': 'MB', 'duration_units':'minutes', 'stats': stats }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)
 

class GetDailyDurationCount(object):
    def on_get(self, req, resp):
        interval = req.get_param('interval')
        if interval is not None:
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
                            'format': '%Y/%m/%d',
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
                doc['durationCount'] = doc['durationCount'] / 60
                daily_count.append(doc)

            message = {'success': True, 'units': 'minutes', 'stats': daily_count}

        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAverageDuration(object):
    def on_get(self, req, resp):
        interval = req.get_param('interval')
        _filter = req.get_param('filter')
        _format = req.get_param('format')
        if interval is not None and _format is not None:
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
                    'average': {
                        '$avg': '$Sum'
                    }
                }
            }])

            for doc in result:
                doc['average'] = doc['average'] / 60
                avg_count.append(doc)

            message = {'success': True, 'units': 'minutes', 'average': avg_count[0]['average']}

        elif _filter is not None and _format is None:
            message = getDailyAverageDuration()

        elif _filter is not None and _format is not None:
            message = getLastAverageDuration()

        else:
            message = {'success': False, 'message': 'No appropriate param found'}

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


class GetNodeBWStats(object):
    def on_get(self, req, resp):
        stats = []
        result = db.connections.aggregate([{
            "$group":{
                "_id":"$vpn_addr",
                "total_sessions_count":{
                    "$sum":1
                },
                "total_bandwidth":{
                    "$sum":"$server_usage.down"
                },
                "last_24hours":{
                    "$sum":{
                        "$cond":[{"$gte":["$start_time",{"$subtract":[int(time.time()),24*60*60]}]},"$server_usage.down",0]
                    }
                },
                "last_7days":{
                    "$sum":{"$cond":[{"$gte":["$start_time",{"$subtract":[int(time.time()),7*24*60*60]}]},"$server_usage.down",0]
                }},
                "last_month":{
                    "$sum":{"$cond":[{"$gte":["$start_time",{"$subtract":[int(time.time()),30*24*60*60]}]},"$server_usage.down",0]
                }
            }}
        },{
            "$sort":{"total_bandwidth":-1}}
        ])

        for doc in result:
            doc['total_bandwidth'] = doc['total_bandwidth'] / (1024 * 1024)
            doc['last_24hours'] = doc['last_24hours'] / (1024 * 1024)
            doc['last_7days'] = doc['last_7days'] / (1024 * 1024)
            doc['last_month'] = doc['last_month'] / (1024 * 1024)
            stats.append(doc)

        message = {'success': True, 'units': 'MB', 'stats': stats }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)

class GetActiveSessionCountOld(object):
    def on_get(self, req, resp):
        count = db.connections.find({'end_time': None}).count()
        message = {'success': True, 'count': count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyActiveNodeCountOld(object):
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


class GetActiveNodeCountOld(object):
    def on_get(self, req, resp):
        count = db.nodes.find({'vpn.status': 'up'}).count()
        message = {'success': True, 'count': count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyDataCountOld(object):
    def on_get(self, req, resp):
        daily_count = []
        _ = db.connections.find({'server_usage': {'$exists': True}})

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


class GetTotalDataCountOld(object):
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


class GetAverageDurationOld(object):
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
