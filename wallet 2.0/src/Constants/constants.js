
module.exports = {
    B_URL: 'https://api.sentinelgroup.io',
    BOOT_URL: 'https://bootnode-gateway.sentinelgroup.io',
    TMain_URL: 'http://185.222.24.72:8000',
    S_URL: 'https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=',
    SM_URL: '&address=',
    SE_URL: '&page=1&offset=100&sort=asc&apikey=YourApiKeyToken',
    TM_URL: 'http://localhost:1317',
    TM_FREE_TOKEN_URL: 'https://api-tm.sentinelgroup.io',
    menuItems: [
        {
            'name': 'HISTORY',
            'value': 'history',
            'icon': 'historyIcon'
        },
        {
            'name': 'SEND',
            'value': 'send',
            'icon': 'sendIcon'
        },
        {
            'name': 'RECEIVE',
            'value': 'receive',
            'icon': 'receiveIcon'
        },
        {
            'name': 'VPN LIST',
            'value': 'vpnList',
            'icon': 'listIcon'
        },
        {
            'name': 'VPN HISTORY',
            'value': 'vpnHistory',
            'icon': 'vpnHisIcon'
        },
        {
            'name': 'SWIXER',
            'value': 'swixer',
            'icon': 'swixerIcon'
        },
        {
            'name': 'SWAPS',
            'value': 'swaps',
            'icon': 'swapIcon'
        },
        {
            'name': 'TENDERMINT',
            'value': 'tmint',
            'icon': 'tmintIcon'
        }
    ],
    disabledItemsTest: [
        'swixer',
        'swaps',
        'tmint'
    ],
    disabledItemsMain: [
        'vpnHistory',
        'vpnList',
        'tmint'
    ],
    disabledItemsTM: [
        'history',
        'send',
        'receive',
        'swixer',
        'swaps'
    ]
};
