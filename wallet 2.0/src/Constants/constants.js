
module.exports = {
    B_URL: 'https://api.sentinelgroup.io',
    BOOT_URL: 'https://bootnode-gateway.sentinelgroup.io',
    TMain_URL: 'http://185.222.24.72:8000',
    S_URL: 'https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=',
    SM_URL: '&address=',
    SE_URL: '&page=1&offset=100&sort=asc&apikey=YourApiKeyToken',
    TM_URL: 'http://localhost:1317',
    TM_FREE_TOKEN_URL: 'https://api-tm.sentinelgroup.io',

    menuItemsIcons: [
        {
            'name': 'TENDERMINT',
            'value': 'tmint',
            'icon': 'tmintIcon'
        },

        {
            'name': 'ETHEREUM',
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
            'name': 'TX HISTORY',
            'value': 'history',
            'icon': 'historyIcon'
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
            'name': 'ACCOUNT', // // should point to Account tab page
            'value': 'receive',
            'icon': 'receiveIcon'
        },
        {
            'name': 'TRANSFER', // should point to Transfer tab page
            'value': 'send',
            'icon': 'sendIcon'
        },
        {
            'name': 'TX HISTORY',
            'value': 'history',
            'icon': 'historyIcon'
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