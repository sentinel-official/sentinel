import * as EthHelper from '../helpers/eth';

/**
* @api {post} /client/raw-transaction Send raw transaction to specific chain.
* @apiName RawTransaction
* @apiGroup Transactions
* @apiParam {String} tx_data Hex code of the transaction.
* @apiParam {String} net Ethereum chain name {main | rinkeby}.
* @apiSuccess {String} tx_hash Transaction hash.
*/

export const rawTransaction = (req, res) => {
  let txData = req.body['tx_data'];
  let net = req.body['net'];

  EthHelper.rawTransaction(txData, net, (err, txHash) => {
    if (err) {
      res.send({
        'success': false,
        'error': err,
        'message': 'Error occurred while initiating the transaction.'
      })
    } else {
      res.send({
        'success': true,
        'txHash': txHash,
        'message': 'Transaction initiated successfully.'
      })
    }
  })
}