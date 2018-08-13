export const MAIN_TOKENS = {
    'SENT': {
        'name': 'SENTinel',
        'address': '0xa44e5137293e855b1b7bc7e2c6f8cd796ffcb037'.toLowerCase(),
        'abi': [{
        "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }],
            "payable": false, "stateMutability": "view", "type": "function"
        }, {
        "constant": false, "inputs": [
            { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }
        ], "name": "approve",
            "outputs": [{
            "name": "success",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "services",
            "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view",
            "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }],
            "payable": false, "stateMutability": "view", "type": "function"
        }, {
        "constant": false, "inputs": [
            { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ], "name": "transferFrom", "outputs": [
            { "name": "success", "type": "bool" }
        ], "payable": false, "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }],
            "payable": false, "stateMutability": "view", "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn",
            "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf",
            "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view",
            "type": "function"
        }, {
        "constant": false, "inputs": [{ "name": "_from", "type": "address" },
        { "name": "_value", "type": "uint256" }],
            "name": "burnFrom", "outputs": [{ "name": "success", "type": "bool" }],
            "payable": false, "stateMutability": "nonpayable", "type": "function"
        },
        {
        "constant": false,
            "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_from", "type": "address" },
            { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
            "name": "payService", "outputs": [], "payable": false, "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }],
            "payable": false, "stateMutability": "view", "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }],
            "payable": false, "stateMutability": "view", "type": "function"
        }, {
        "constant": false, "inputs": [
            { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }
        ], "name": "transfer",
            "outputs": [], "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": false,
            "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" },
            { "name": "_extraData", "type": "bytes" }], "name": "approveAndCall",
            "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }],
            "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false,
            "stateMutability": "view", "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwnership",
            "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" },
        { "name": "_serviceAddress", "type": "address" }], "name": "deployService",
            "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
        }, {
            "inputs": [{ "name": "_tokenName", "type": "string" }, { "name": "_tokenSymbol", "type": "string" },
            { "name": "_decimals", "type": "uint8" }, { "name": "_totalSupply", "type": "uint256" }],
            "payable": false, "stateMutability": "nonpayable", "type": "constructor"
        }, {
        "anonymous": false,
            "inputs": [
                {
                "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
        "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn",
            "type": "event"
        }]
    },
    'BNB': {
        'name': 'Binance Coin',
        'address': '0xb8c77482e45f1f44de1745f52c74426c631bdd52'.toLowerCase(),
        'abi': [{
        "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }],
            "payable": false, "type": "function"
        }, {
        "constant": false,
            "inputs": [{ "name": "_spender", "type": "address" },
            { "name": "_value", "type": "uint256" }],
            "name": "approve",
            "outputs": [{ "name": "success", "type": "bool" }],
            "payable": false, "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }],
            "payable": false, "type": "function"
        }, {
        "constant": false,
            "inputs": [{ "name": "_from", "type": "address" },
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }],
            "name": "transferFrom",
            "outputs": [{ "name": "success", "type": "bool" }],
            "payable": false, "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }],
            "payable": false, "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdrawEther",
            "outputs": [], "payable": false, "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn",
            "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "unfreeze",
            "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function"
        },
        {
        "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf",
            "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }],
            "payable": false, "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }],
            "payable": false, "type": "function"
        }, {
        "constant": false,
            "inputs": [{ "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }],
            "name": "transfer", "outputs": [], "payable": false,
            "type": "function"
        },
        {
        "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "freezeOf",
            "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "freeze",
            "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function"
        },
        {
        "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }],
            "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false,
            "type": "function"
        }, {
            "inputs": [{ "name": "initialSupply", "type": "uint256" }, { "name": "tokenName", "type": "string" },
            { "name": "decimalUnits", "type": "uint8" }, { "name": "tokenSymbol", "type": "string" }],
            "payable": false, "type": "constructor"
        }, { "payable": true, "type": "fallback" },
        {
        "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" },
        { "indexed": true, "name": "to", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }],
            "name": "Transfer", "type": "event"
        }, {
        "anonymous": false,
            "inputs": [{ "indexed": true, "name": "from", "type": "address" },
            {
            "indexed": false, "name": "value",
                "type": "uint256"
            }], "name": "Burn",
            "type": "event"
        }, {
        "anonymous": false, "inputs": [
            { "indexed": true, "name": "from", "type": "address" },
            { "indexed": false, "name": "value", "type": "uint256" }
        ], "name": "Freeze", "type": "event"
        },
        {
        "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }],
            "name": "Unfreeze", "type": "event"
        }]
    }
};
export const RINKEBY_TOKENS = {
    'SENT': {
        'name': 'Sentinel Test Token',
        'address': '0x29317B796510afC25794E511e7B10659Ca18048B'.toLowerCase(),
        'abi': [{
        "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }],
            "payable": false, "stateMutability": "view", "type": "function"
        }, {
        "constant": false, "inputs": [
            { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }
        ], "name": "approve",
            "outputs": [{
            "name": "success",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "services",
            "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view",
            "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }],
            "payable": false, "stateMutability": "view", "type": "function"
        }, {
        "constant": false, "inputs": [
            { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ], "name": "transferFrom", "outputs": [
            { "name": "success", "type": "bool" }
        ], "payable": false, "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }],
            "payable": false, "stateMutability": "view", "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn",
            "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf",
            "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view",
            "type": "function"
        }, {
        "constant": false, "inputs": [{ "name": "_from", "type": "address" },
        { "name": "_value", "type": "uint256" }],
            "name": "burnFrom", "outputs": [{ "name": "success", "type": "bool" }],
            "payable": false, "stateMutability": "nonpayable", "type": "function"
        },
        {
        "constant": false,
            "inputs": [{ "name": "_serviceName", "type": "bytes32" }, { "name": "_from", "type": "address" },
            { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
            "name": "payService", "outputs": [], "payable": false, "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }],
            "payable": false, "stateMutability": "view", "type": "function"
        },
        {
        "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }],
            "payable": false, "stateMutability": "view", "type": "function"
        }, {
        "constant": false, "inputs": [
            { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }
        ], "name": "transfer",
            "outputs": [], "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": false,
            "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" },
            { "name": "_extraData", "type": "bytes" }], "name": "approveAndCall",
            "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable",
            "type": "function"
        },
        {
        "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }],
            "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false,
            "stateMutability": "view", "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwnership",
            "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
        },
        {
        "constant": false, "inputs": [{ "name": "_serviceName", "type": "bytes32" },
        { "name": "_serviceAddress", "type": "address" }], "name": "deployService",
            "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
        }, {
            "inputs": [{ "name": "_tokenName", "type": "string" }, { "name": "_tokenSymbol", "type": "string" },
            { "name": "_decimals", "type": "uint8" }, { "name": "_totalSupply", "type": "uint256" }],
            "payable": false, "stateMutability": "nonpayable", "type": "constructor"
        }, {
        "anonymous": false,
            "inputs": [
                {
                "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
        "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn",
            "type": "event"
        }]
    }
};