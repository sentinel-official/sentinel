import rlp
from ethereum.transactions import Transaction

from .eth import mainnet
from ..config import SENTINEL_ABI
from ..config import SENTINEL_ADDRESS
from ..config import SENTINEL_NAME

from ..config import DECIMALS


class SentinelManger(object):
    def __init__(self):
        self.contract = mainnet.web3.eth.contract(
            contract_name=SENTINEL_NAME, abi=SENTINEL_ABI, address=SENTINEL_ADDRESS)

    def get_balance(self, account_addr):
        try:
            caller_object = {
                'from': account_addr,
                'to': SENTINEL_ADDRESS,
                'data': mainnet.web3.toHex(mainnet.web3.toBytes(hexstr=self.contract.encodeABI(fn_name='balanceOf', args=[account_addr])))
            }
            balance = mainnet.web3.toInt(
                hexstr=mainnet.web3.eth.call(caller_object))
            balance = balance / (DECIMALS * 1.0)
        except Exception as err:
            return {'code': 201, 'error': str(err)}, None
        return None, balance


sentinel_manager = SentinelManger()
