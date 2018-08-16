
module.exports = {
    B_URL: 'https://api.sentinelgroup.io',
    S_URL: 'https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=',
    SM_URL: '&address=',
    SE_URL: '&page=1&offset=100&sort=asc&apikey=YourApiKeyToken',
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
    ]
};
