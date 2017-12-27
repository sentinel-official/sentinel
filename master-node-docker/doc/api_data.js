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
    "filename": "sentinel/client/account.py",
    "groupTitle": "Account"
  },
  {
    "type": "post",
    "url": "/client/account/balance",
    "title": "Get account balance.",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "unit",
            "description": "<p>Unit either <code>SENT</code> or <code>ETH</code>.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "balance",
            "description": "<p>Account balance in specified units.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "sentinel/client/account.py",
    "groupTitle": "Account"
  },
  {
    "type": "post",
    "url": "/client/transaction/history",
    "title": "Transaction history of the specific account.",
    "name": "TransactionHistory",
    "group": "Transactions",
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
            "type": "Object",
            "optional": false,
            "field": "history",
            "description": "<p>Detailed transaction history.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "sentinel/client/transactions.py",
    "groupTitle": "Transactions"
  },
  {
    "type": "post",
    "url": "/client/transcation/receipt",
    "title": "Transaction receipt of the specific transaction.",
    "name": "TranscationReceipt",
    "group": "Transactions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tx_hash",
            "description": "<p>Transaction hash of the transaction.</p>"
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
            "field": "receipt",
            "description": "<p>Detailed transaction receipt.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "sentinel/client/transactions.py",
    "groupTitle": "Transactions"
  },
  {
    "type": "post",
    "url": "/client/transaction",
    "title": "Transfer amount from one account to another.",
    "name": "TransferAmount",
    "group": "Transactions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "from_addr",
            "description": "<p>Sender account address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "to_addr",
            "description": "<p>Receiver account address.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>Amount that has to be transferred.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "unit",
            "description": "<p>Unit either <code>SENT</code> or <code>ETH</code>.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keystore",
            "description": "<p>Keystore file data of the sender account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the sender account.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "session_id",
            "description": "<p>Session ID of the VPN session if it's a VPN payment.</p>"
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
            "description": "<p>Transaction hash of the transaction.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "sentinel/client/transactions.py",
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
            "type": "String[]",
            "optional": false,
            "field": "ovpn",
            "description": "<p>Ovpn file data of the VPN server.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "sentinel/client/vpn.py",
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
    "filename": "sentinel/client/vpn.py",
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
    "filename": "sentinel/client/vpn.py",
    "groupTitle": "VPN"
  }
] });
