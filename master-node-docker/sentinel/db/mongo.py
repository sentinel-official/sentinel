# coding=utf-8
from pymongo import MongoClient

mongo_client = MongoClient(maxPoolSize=None, maxIdleTimeMS=(120 * 1000))
db = mongo_client.sentinel
