
module.exports = {
    B_URL: 'https://api.sentinelgroup.io',
    BOOT_URL: 'https://bootnode-gateway.sentinelgroup.io',
    TMain_URL: 'http://tm-master.sentinelgroup.io:8000',
    S_URL: 'https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=',
    SM_URL: '&address=',
    SE_URL: '&page=1&offset=100&sort=asc&apikey=YourApiKeyToken',
    TM_URL: 'http://localhost:1317',
    TM_FREE_TOKEN_URL: 'http://tm-api.sentinelgroup.io:3000',

    notTestItemIcons: [

        // {
        //     'name': 'ETH',
        //     'value': 'eth',
        //     'icon': 'ethereumIcon'
        // },

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

    ],

    testMenuItemsIcons: [
        // {
        //     'name': 'TM',
        //     'value': 'tmint',
        //     'icon': 'tmintIcon'
        // },

        // {
        //     'name': 'ETH',
        //     'value': 'eth',
        //     'icon': 'ethereumIcon'
        // },

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
      

    ],
    testMenuItems: [

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
      
      
    ],
    notInTestMenuItems : [

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
      
       
    ],


    TMdisabledmenuItems: [

      
        {
            'name': 'Account', 
            'value': 'receive',
            'icon': 'receiveIcon'
        },
     

    ],
    disabledItemsTest: [
        'swixer',
        'swaps',
    ],
    disabledItemsMain: [
        'vpnHistory',
        'vpnList',
    ],
    disabledItemsTM: [
        'history',
        'send',
        'vpnList',
        'vpnHistory'
    ]
};