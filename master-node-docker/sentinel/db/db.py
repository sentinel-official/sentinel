"""__doc__"""

from pymongo import MongoClient


db_client = MongoClient()
db = db_client.sentinel
