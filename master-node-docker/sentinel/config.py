CONTRACT_ABI = [ { "constant": True, "inputs": [ { "name": "_addr", "type": "address" } ], "name": "getBalanceOf", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": False, "stateMutability": "view", "type": "function" }, { "constant": False, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "gas_amount", "type": "uint256" } ], "name": "transferAmount", "outputs": [], "payable": False, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "initial Supply", "template": "elements_input_uint", "value": "100000000000000000000" } ], "payable": False, "stateMutability": "nonpayable", "type": "constructor" } ]
CONTRACT_ADDRESS = '0xa8901383A410209c3AFb69834FeeC0eBFF63f232'
CONTRACT_NAME = 'Sentinel_test'
COINBASE_PASSWORD = 'sent123'
CONV_UNITS = 1e-04
