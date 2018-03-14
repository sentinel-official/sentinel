import logging
import pprint

from chalk import log

pp = pprint.PrettyPrinter(indent=4)

logger = logging.getLogger('log')
handler = log.ChalkHandler()
handler.setLevel(logging.DEBUG)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)
