import { Log } from "../models";
import database from "../db/database"

const logTheError = (req, res) => {
  let os = req.body['os'].toString();
  let accountAddr = req.body['account_addr'].toLowerCase();
  let errorStr = req.body['error_str'].toLowerCase();
  let logType = 'error';

  let data = {
    os: os,
    account_addr: accountAddr,
    error_str: errorStr,
    log_type: logType
  }
  let logData = new Log(data);

  database.insert(logData, (err, resp) => {
    if (err) res.status(400).send({ success: false, message: 'error in logging error data' })
    else res.status(200).send({ success: true, message: 'error reported successfully' })
  })
}

export default {
  logTheError
}