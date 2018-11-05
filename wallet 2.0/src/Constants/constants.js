
module.exports = {
    B_URL: 'https://api.sentinelgroup.io',
    BOOT_URL: 'https://bootnode-gateway.sentinelgroup.io',
    TMain_URL: 'http://tm-master.sentinelgroup.io:8000',
    S_URL: 'https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=',
    SM_URL: '&address=',
    SE_URL: '&page=1&offset=100&sort=asc&apikey=YourApiKeyToken',
    TM_URL: 'http://localhost:1317',
    TM_FREE_TOKEN_URL: 'http://tm-api.sentinelgroup.io:3000',

    menuItemsIcons: [
        {
            'name': 'TM',
            'value': 'tmint',
            'icon': 'tmintIcon'
        },

        {
            'name': 'ETH',
            'value': 'eth',
            'icon': 'ethereumIcon'
        },
       
    ],
    menuItems: [

        // {
        //     'name': 'VPN LIST',
        //     'value': 'vpnList',
        //     'icon': 'listIcon'
        // },
        // {
        //     'name': 'SEND',
        //     'value': 'send',
        //     'icon': 'sendIcon'
        // },
        // {
        //     'name': 'RECEIVE',
        //     'value': 'receive',
        //     'icon': 'receiveIcon'
        // },
        // {
        //     'name': 'HISTORY',
        //     'value': 'history',
        //     'icon': 'historyIcon'
        // },

        // initilal 

        {
            'name': 'Send',
            'value': 'send',
            'icon': 'sendIcon'
        },
        {
            'name': 'Receive',
            'value': 'receive',
            'icon': 'receiveIcon'
        },
        {
            'name': 'TxHistory',
            'value': 'history',
            'icon': 'historyIcon'
        },
        {
            'name': 'VpnList',
            'value': 'vpnList',
            'icon': 'listIcon'
        },

        {
            'name': 'VpnHistory',
            'value': 'vpnHistory',
            'icon': 'vpnHisIcon'
        },
        // {
        //     'name': 'SWIXER',
        //     'value': 'swixer',
        //     'icon': 'swixerIcon'
        // },
        // {
        //     'name': 'SWAPS',
        //     'value': 'swaps',
        //     'icon': 'swapIcon'
        // },

        // {
        //     'name': 'TENDERMINT',
        //     'value': 'tmint',
        //     'icon': 'tmintIcon'
        // }
    ],


    TMmenuItems: [
        {
            'name': 'Account', // // should point to Account tab page
            'value': 'receive',
            'icon': 'receiveIcon'
        },
        {
            'name': 'Transfer', // should point to Transfer tab page
            'value': 'send',
            'icon': 'sendIcon'
        },
        {
            'name': 'TxHistory',
            'value': 'history',
            'icon': 'historyIcon'
        },
        {
            'name': 'VpnList',
            'value': 'vpnList',
            'icon': 'listIcon'
        },

        {
            'name': 'VpnHistory',
            'value': 'vpnHistory',
            'icon': 'vpnHisIcon'
        },

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
        'vpnList',
        'vpnHistory'
    ]
};