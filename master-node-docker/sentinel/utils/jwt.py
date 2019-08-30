# coding=utf-8
from falcon_auth import JWTAuthBackend

from ..config import JWT_SECRET

user_loader = lambda decoded: decoded['user']
jwt = JWTAuthBackend(user_loader, JWT_SECRET, auth_header_prefix='Bearer', expiration_delta=10 * 60)
