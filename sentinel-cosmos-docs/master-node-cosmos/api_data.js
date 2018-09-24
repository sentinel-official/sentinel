define({ "api": [
  {
    "type": "GET",
    "url": "/nodes",
    "title": "Get Information of nodes",
    "name": "getNodes",
    "group": "Node",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Node type [OpenVPN, Socks5].</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Node status [up, down].</p>"
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
            "type": "Object[]",
            "optional": false,
            "field": "nodes",
            "description": "<p>List of nodes.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  nodes: [\n    \n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/node.controller.js",
    "groupTitle": "Node"
  },
  {
    "type": "GET",
    "url": "/session",
    "title": "Get info of a new session",
    "name": "getSession",
    "group": "Session",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hash",
            "description": "<p>Transaction hash of the initial session payment.</p>"
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
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>URL of the node endpoint.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "sessionId",
            "description": "<p>Unique session ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token for communication with node.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  url: \n  sessionId: \n  token: \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/session.controller.js",
    "groupTitle": "Session"
  }
] });
