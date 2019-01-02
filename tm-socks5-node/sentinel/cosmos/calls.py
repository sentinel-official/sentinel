# coding=utf-8
import json

from .routes import routes
from ..config import COSMOS_URL
from ..utils import fetch


def call(name, data):
    url = COSMOS_URL + routes[name]['route']
    method = routes[name]['method']

    if name == 'verify_hash':
        url += '/{}'.format(data['hash'])
    elif name == 'get_balance':
        url += '/{}'.format(data['address'])

    try:
        response = None
        if method == 'GET':
            response = fetch().get(url)
        elif method == 'POST':
            response = fetch().post(url, json=data)

        if response and response.status_code == 200:
            if name == 'generate_seed':
                return None, {
                    'success': True,
                    'seed': response.content.decode()
                }
            elif name in ['get_keys', 'get_balance', 'verify_hash']:
                data = json.loads(response.content.decode())
                data.update({'success': True})
                return None, data
            else:
                data = response.json()
                if data['success']:
                    return None, data
                return {
                           'code': 2,
                           'message': 'Response data success is False.',
                           'error': str(response.content)
                       }, None
        return {
                   'code': 2,
                   'message': 'Response status code is not 200.',
                   'error': str(response.content)
               }, None
    except Exception as error:
        return str(error), None
