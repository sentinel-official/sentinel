# coding=utf-8

import requests


def get_nonce(account_addr, net):
    try:
        url = "http://127.0.0.1:3000/nonce?account_addr={}&net={}".format(account_addr, net)
        resp = requests.get(url)
        resp = resp.json()
        return resp["nonce"]
    except Exception as err:
        return None


def set_nonce(account_addr, net, nonce=None):
    try:
        url = "http://127.0.0.1:3000/nonce"
        body = {
            "account_addr": account_addr,
            "net": net
        }
        if nonce:
            body["nonce"] = nonce
        resp = requests.put(url, json=body)
        resp = resp.json()
        return resp["nonce"]
    except Exception as err:
        return None
