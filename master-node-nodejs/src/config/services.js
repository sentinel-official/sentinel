export const VPN_SERVICE = {
    'name': 'Vpn_service',
    'address': '0x86c592a4Ab2De10D8F1Ad3AD91e40BD676F559f2'.toLowerCase(),
    'abi': [{
    "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "addAuthorizedUser",
        "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
    }, {
    "constant": false,
        "inputs": [{
            "name": "_from",
            "type": "address"
        },
        {
            "name": "_to",
            "type": "address"
        },
        {
            "name": "_receivedBytes",
            "type": "uint256"
        },
        {
            "name": "_sessionDuration",
            "type": "uint256"
        },
        {
            "name": "_amount",
            "type": "uint256"
        },
        {
            "name": "_timestamp",
            "type": "uint256"
        },
        {
            "name": "_sessionId",
            "type": "bytes32"
        }],
        "name": "addVpnUsage",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
    "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_amount", "type": "uint256" },
    { "name": "_sessionId", "type": "bytes32" }], "name": "payVpnSession",
        "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
    },
    {
    "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "removeAuthorizedUser",
        "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
    },
    {
    "constant": false, "inputs": [{ "name": "_addr", "type": "address" }, { "name": "_isPaid", "type": "bool" }],
        "name": "setInitialPaymentStatusOf", "outputs": [], "payable": false, "stateMutability": "nonpayable",
        "type": "function"
    },
    {
    "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwnership",
        "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
    },
    { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" },
    {
    "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "authorizedUsers",
        "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view",
        "type": "function"
    },
    {
    "constant": true, "inputs": [{ "name": "_address", "type": "address" }], "name": "getDueAmountOf",
        "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view",
        "type": "function"
    },
    {
    "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "getInitialPaymentStatusOf",
        "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view",
        "type": "function"
    },
    {
    "constant": true, "inputs": [{ "name": "_address", "type": "address" }], "name": "getVpnSessionsCountOf",
        "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view",
        "type": "function"
    }, {
    "constant": true, "inputs": [{ "name": "_address", "type": "address" },
    { "name": "_sessionId", "type": "bytes32" }],
        "name": "getVpnUsageOf",
        "outputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" },
        { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" },
        { "name": "", "type": "uint256" }, { "name": "", "type": "bool" }],
        "payable": false, "stateMutability": "view", "type": "function"
    },
    {
    "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }],
        "payable": false, "stateMutability": "view", "type": "function"
    }]
};
