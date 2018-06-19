export const logTheError = (req, res) => {
  let os = req.body['os'].toString();
  let accountAddr = req.body['account_addr'].toLowerCase();
  let errorStr = req.body['error_str'].toLowerCase();
  let logType = 'error';

  global.db.collection('logs').insertOne({
    'os': os,
    'account_addr': accountAddr,
    'error_str': errorStr,
    'log_type': logType
  }, (err, resp) => {
    res.send({
      'success': true,
      'message': 'Error reported successfully.'
    })
  })
}