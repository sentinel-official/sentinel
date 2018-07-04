import async from "async";

const updateCount = (req, res) => {
  let data = req.body;
  let count = parseInt(data.invalidCount);
  async.waterfall([
    (next) => {
      global.db.collection('validations').findOne({ nodeID: data.nodeID }, (err, resp) => {
        if (err) {
          next({
            success: false,
            message: 'error occured while getting details'
          }, null);
        } else if (resp) {
          count += parseInt(resp.invalidCount)
          next()
        } else {
          next();
        }
      })
    }, (next) => {
      console.log('count is', count);
      if (count > 5) {
        global.db.collection('nodes').findOneAndDelete({ ip: data.ipAddr }, (err, resp) => {
          console.log('result', err, resp)
          if (!err && resp.value) {
            next()
          } else {
            next({
              success: false,
              message: 'did not find the node'
            }, null)
          }
        })
      } else {
        next()
      }
    }, (next) => {
      global.db.collection('validations').update({ nodeID: data.nodeID }, data, { upsert: true }, (err, resp) => {
        if (!err) {
          next(null, {
            success: true,
            message: 'updated successfully'
          })
        } else {
          next({
            success: false,
            message: 'error occured while storing details'
          }, null)
        }
      })
    }
  ], (err, resp) => {
    if (err) res.status(400).send(err);
    else res.status(200).send(resp);
  })
}

const getActiveNodes = (req, res) => {
  global.db.collection('nodes').find({ 'vpn.status': 'up' }).toArray((err, resp) => {
    console.log('err, resp', err, resp)
    if (!err) {
      res.send({
        success: true,
        count: resp.length
      })
    } else {
      res.send({
        success: false,
        message: 'err in getting active nodes'
      })
    }
  })
}

export default {
  updateCount,
  getActiveNodes
}