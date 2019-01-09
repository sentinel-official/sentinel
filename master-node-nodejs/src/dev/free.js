import ETHHelper from '../helpers/eth'
import { DECIMALS } from '../config/vars';
import { Free } from '../models';
import database from '../db/database';

let db = null;

const checkFree = (toAddr, cb) => {
  Free.findOne({ to_addr: toAddr }, (err, tx) => {
    if (!tx) cb(false)
    else cb(true)
  })
}

const insertFree = (toAddr, cb) => {
  let data = {
    to_addr: toAddr
  }
  let freeData = new Free(data)
  database.insert(freeData, (err, resp) => {
    cb(err, resp)
  })
}

const getFreeAmount = (req, res) => {

  let accountAddr = req.body['account_addr'];
  let eths = parseInt(0.25 * Math.pow(10, 18))
  let sents = parseInt(1000 * (DECIMALS * 1.0))

  checkFree(accountAddr, (txDone) => {
    if (txDone) {
      res.send({
        'success': false,
        'message': 'Test Tokens already claimed'
      })
    } else {
      ETHHelper.free(accountAddr, eths, sents, (errors, txHashes) => {
        if (errors.length > 0) {
          res.send({
            'success': false,
            'errors': errors,
            'txHashes': txHashes,
            'message': 'Error occurred while transferring free amount.'
          })
        } else {
          insertFree(accountAddr, (err, resp) => {
            res.send({
              'success': true,
              'errors': errors,
              'txHashes': txHashes,
              'message': 'Successfully transferred Test Tokens'
            })
          });
        }
      })
    }
  })
}

export default {
  getFreeAmount
}