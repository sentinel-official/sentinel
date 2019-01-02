# coding=utf-8
from pymongo import MongoClient

from ..config import DB_ADDRESS as ADDRESS
from ..config import DB_PASSWORD as PASSWORD
from ..config import DB_USER as USER

URI = 'mongodb://{}:{}@{}'.format(USER, PASSWORD, ADDRESS)
mongo_client = MongoClient(URI, maxPoolSize=None, maxIdleTimeMS=(120 * 1000))
db = mongo_client.sentinel
