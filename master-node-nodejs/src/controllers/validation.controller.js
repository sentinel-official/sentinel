import async from "async";
import { Validation, Node } from "../models";
import database from "../db/database";

const updateCount = (req, res) => {
  let data = req.body;
  let count = parseInt(data.invalidCount);
  async.waterfall([
    (next) => {
      Validation.findOne({ nodeID: data.nodeID }, (err, resp) => {
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
      if (count > 5) {
        Node.findOneAndRemove({ ip: data.ipAddr }, (err, resp) => {
          if (!err && resp) {
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
      let findData = {
        nodeID: data.nodeID
      }
      let options = {
        upsert: true
      }

      database.update(findData, data, options, (err, resp) => {
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
  Node.find({ 'vpn.status': 'up' }, (err, resp) => {
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