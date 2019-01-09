# coding=utf-8
routes = {
    'delete_master_node': {
        'route': '/master',
        'method': 'DELETE',
    },
    'delete_vpn_node': {
        'route': '/vpn',
        'method': 'DELETE',
    },
    'pay_vpn': {
        'route': '/vpn/pay',
        'method': 'POST',
    },
    'refund': {
        'route': '/refund',
        'method': 'POST',
    },
    'get_keys': {
        'route': '/keys',
        'method': 'POST',
    },
    'get_vpn_payment': {
        'route': '/vpn/getpayment',
        'method': 'POST',
    },
    'generate_seed': {
        'route': '/keys/seed',
        'method': 'GET',
    },
    'register_master_node': {
        'route': '/register/master',
        'method': 'POST',
    },
    'register_vpn_node': {
        'route': '/register/vpn',
        'method': 'POST',
    },
    'verify_hash': {
        'route': '/txs',
        'method': 'GET'
    },
    'get_balance': {
        'route': '/accounts',
        'method': 'GET'
    }
}
