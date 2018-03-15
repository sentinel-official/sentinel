define({ "api": [
  {
    "type": "post",
    "url": "/client/account",
    "title": "Create new account for the Sentinel user.",
    "name": "CreateNewAccount",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password for creating the new account.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "account_addr",
            "description": "<p>New account address.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "private_key",
            "description": "<p>Private key of the account.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "keystore",
            "description": "<p>Keystore file data of the account.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./sentinel/client/account.py",
    "groupTitle": "Account"
  },
  {
    "type": "post",
    "url": "/client/account/balance",
    "title": "Get account balances.",
    "name": "GetBalance",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_addr",
            "description": "<p>Address of the account.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "balances",
            "description": "<p>Account balances.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./sentinel/client/account.py",
    "groupTitle": "Account"
  },
  {
    "type": "post",
    "url": "/client/raw-transaction",
    "title": "Send raw transaction to specific chain.",
    "name": "RawTransaction",
    "group": "Transactions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tx_data",
            "description": "<p>Hex code of the transaction.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "net",
            "description": "<p>Ethereum chain name {main | rinkeby}.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tx_hash",
            "description": "<p>Transaction hash.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./sentinel/client/transactions.py",
    "groupTitle": "Transactions"
  },
  {
    "type": "post",
    "url": "/client/vpn",
    "title": "Get VPN server credentials.",
    "name": "GetVpnCredentials",
    "group": "VPN",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_addr",
            "description": "<p>Account address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vpn_addr",
            "description": "<p>Account address of the VPN server.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ip",
            "description": "<p>IP address of the VPN server.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "port",
            "description": "<p>Port number of the VPN server.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Unique token for validation.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./sentinel/client/vpn.py",
    "groupTitle": "VPN"
  },
  {
    "type": "post",
    "url": "/client/vpn/current",
    "title": "Get current VPN usage.",
    "name": "GetVpnCurrentUsage",
    "group": "VPN",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_addr",
            "description": "<p>Account address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "session_name",
            "description": "<p>Session name of the VPN connection.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "usage",
            "description": "<p>Current VPN usage.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./sentinel/client/vpn.py",
    "groupTitle": "VPN"
  },
  {
    "type": "post",
    "url": "/client/vpn/usage",
    "title": "Get VPN user details of specific account.",
    "name": "GetVpnUsage",
    "group": "VPN",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_addr",
            "description": "<p>Account address.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "usage",
            "description": "<p>VPN usage details.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./sentinel/client/vpn.py",
    "groupTitle": "VPN"
  },
  {
    "type": "get",
    "url": "/client/vpn/list",
    "title": "Get all unoccupied VPN servers list.",
    "name": "GetVpnsList",
    "group": "VPN",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "list",
            "description": "<p>Details of all VPN servers.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./sentinel/client/vpn.py",
    "groupTitle": "VPN"
  },
  {
    "type": "post",
    "url": "/client/vpn/pay",
    "title": "VPN usage payment.",
    "name": "PayVpnUsage",
    "group": "VPN",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "from_addr",
            "description": "<p>Account address.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>Amount to be payed to VPN server.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "session_id",
            "description": "<p>Session ID of the VPN connection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tx_data",
            "description": "<p>Hex code of the transaction.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "net",
            "description": "<p>Ethereum chain name {main | rinkeby}.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Errors if any.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "tx_hashes",
            "description": "<p>Transaction hashes.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./sentinel/client/vpn.py",
    "groupTitle": "VPN"
  }
] });
