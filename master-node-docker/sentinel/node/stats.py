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
        doc['Average'] = doc['Average']/(60)
        daily_count.append(doc)

    message = {'success': True, 'stats': daily_count}
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
            'Average': {
                '$avg': '$Sum'
            }
        }
    }])

    for doc in result:
        doc['Average'] = doc['Average']/(60)
        avg_count.append(doc)

    message = {'success': True, 'average': avg_count}
    return message


class GetDailyDataCount(object):
    def on_get(self, req, resp):
        interval=req.get_param('interval')
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
                doc['dataCount'] = doc['dataCount']/(1024*1024)
                daily_count.append(doc)

            message = {'success': True, 'stats': daily_count}
        
        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetTotalDataCount(object):
    def on_get(self, req, resp):
        format=req.get_param('format')
        if format is not None:
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
                doc['Total'] = doc['Total']/(1024*1024)
                total_count.append(doc)

            message = {'success': True, 'stats': total_count}
        
        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetLastDataCount(object):
    def on_get(self, req, resp):
        filter=req.get_param('filter')
        format=req.get_param('format')
        if filter is not None and format is not None:
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
                doc['Total'] = doc['Total']/(1024*1024)
                total_count.append(doc)

            message = {'success': True, 'stats': total_count}
        
        else:
            message = {'success': False, 'message': 'No params found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyNodeCount(object):
    def on_get(self, req, resp):
        interval=req.get_param('interval')
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
            message = {'success':False, 'message':'No param found'}

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
        interval=req.get_param('interval')
        format=req.get_param('format')
        if interval is not None and format is None:
            if interval=='current':
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
            message = getAverageNodeCount()
        else:
            message = {'success': False,'message': 'No params found'}

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

        message = {'success': True, 'stats': daily_count}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAveragePaidSentsCount(object):
    def on_get(self, req, resp):
        format=req.get_param('format')
        if format is not None:
            avg_count = []

            result = db.payments.aggregate([{'$group': {'_id': 0, 'AverageCount': {'$avg': '$paid_count'}}}])

            for doc in result:
                avg_count.append(doc)

            message = {'success': True, 'average': avg_count}
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
                    '$group': {'_id': 0, 'Avg': {'$avg': '$total'}}}
            ])

            for doc in result:
                avg_count.append(doc)

            message = {'success': True, 'average': avg_count}
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

            message = {'success': True, 'stats': daily_count}
        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailySessionCount(object):
    def on_get(self, req, resp):
        interval=req.get_param('interval')
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
            message = {'success':False, 'message':'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetAverageSessionsCount(object):
    def on_get(self, req, resp):
        interval = req.get_param('interval')
        format = req.get_param('format')
        if interval is not None and format is not None:
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
        
        else:
            message = {'success': False, 'message': 'No params Found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetActiveSessionCount(object):
    def on_get(self, req, resp):
        filter = req.get_param('filter')
        format = req.get_param('format')
        if filter is not None and format is not None:
            count = db.connections.find({'end_time': None}).count()
            message = {'success': True, 'count': count}
        
        else:
            message = {'success': False, 'message': 'No params found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)


class GetDailyDurationCount(object):
    def on_get(self, req, resp):
        interval=req.get_param('interval')
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
                doc['durationCount'] = doc['durationCount']/(60)
                daily_count.append(doc)

            message = {'success': True, 'stats': daily_count}
        
        else:
            message = {'success': False, 'message': 'No param found'}

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(message)

class GetAverageDuration(object):
    def on_get(self, req, resp):
        interval=req.get_param('interval')
        filter=req.get_param('filter')
        format=req.get_param('format')
        if interval is not None and format is not None:
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
                doc['Average'] = doc['Average']/(60)
                avg_count.append(doc)

            message = {'success': True, 'average': avg_count}
        
        elif filter is not None and format is None:
            message = getDailyAverageDuration()
        
        elif filter is not None and format is not None:
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
