define({ "api": [
  {
    "type": "POST",
    "url": "/client/disconnect",
    "title": "Disconnect a client",
    "name": "DisconnectClient",
    "group": "Client",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_addr",
            "description": "<p>Cosmos account address of the client.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "session_id",
            "description": "<p>Unique session ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token for communication with node.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success key.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "sentinel/server/client.py",
    "groupTitle": "Client"
  },
  {
    "type": "POST",
    "url": "/client/usage",
    "title": "Usage of the current session",
    "name": "GetCurrentUsage",
    "group": "Client",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_addr",
            "description": "<p>Cosmos account address of the client.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "session_id",
            "description": "<p>Unique session ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token for communication with node.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success key.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "usage",
            "description": "<p>Usage of the current session.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "sentinel/server/client.py",
    "groupTitle": "Client"
  },
  {
    "type": "POST",
    "url": "/session/sign",
    "title": "Add payment signature for the session",
    "name": "AddSessionPaymentSigns",
    "group": "Session",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_addr",
            "description": "<p>Cosmos account address of the client.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "session_id",
            "description": "<p>Unique session ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token for communication with node.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "signature",
            "description": "<p>Info fo the signature.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "signature.hash",
            "description": "<p>Signature hash.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "signature.index",
            "description": "<p>Signature index.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "signature.amount",
            "description": "<p>Signature amount to be claimed.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "signature.final",
            "description": "<p>Whether Final signature or not.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success key.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "sentinel/server/session.py",
    "groupTitle": "Session"
  },
  {
    "type": "POST",
    "url": "/session/credentials",
    "title": "VPN Session credentials",
    "name": "GetVpnCredentials",
    "group": "Session",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_addr",
            "description": "<p>Cosmos account address of the client.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "session_id",
            "description": "<p>Unique session ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token for communication with node.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success key.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "ovpn",
            "description": "<p>OVPN data.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "sentinel/server/session.py",
    "groupTitle": "Session"
  }
] });
