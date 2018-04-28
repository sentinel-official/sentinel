# coding=utf-8
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry


def fetch(retries=5, backoff_factor=0.3, status_forcelist=(500, 502, 504), session=None):
    session = session or requests.Session()
    adapter = HTTPAdapter(max_retries=Retry(total=retries, read=retries, connect=retries, backoff_factor=backoff_factor,
                                            status_forcelist=status_forcelist))
    session.mount('http://', adapter)
    session.mount('https://', adapter)

    return session
