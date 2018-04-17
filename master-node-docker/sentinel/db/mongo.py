# coding=utf-8
from pymongo import MongoClient

mongo_client = MongoClient(maxPoolSize=None)
db = mongo_client.sentinel
