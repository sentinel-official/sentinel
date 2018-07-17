import async from "async";
import { Validation, Node } from "../models";
import database from "../db/database";

const updateCount = (req, res) => {
  console.log('body', req.body)
  let data = req.body;
  let count = parseInt(data.invalidCount);
  async.waterfall([
    (next) => {
      Validation.findOne({ nodeId: data.nodeId }, (err, resp) => {
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
        data.isBlocked = true;
        Node.findOneAndRemove({ ip: data.nodeId }, (err, resp) => {
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
        nodeId: data.nodeId
      }
      let options = {
        upsert: true
      }

      data.invalidCount = count

      Validation.update(findData, { $set: data }, options, (err, resp) => {

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
        count: resp
      })
    } else {
      res.send({
        success: false,
        message: 'err in getting active nodes'
      })
    }
  })
}

const getBlockedUsers = (req, res) => {
  Validation.find((err, resp) => {
    if (!err) {
      async.each(resp, (item, iterate) => {
        if (!resp.isBlocked)
          resp.isBlocked = false
      }, () => {
        res.send({
          success: true,
          count: resp
        })
      })
    } else {
      res.send({
        success: false,
        message: 'err in getting blocked nodes'
      })
    }
  })
}

export default {
  updateCount,
  getActiveNodes,
  getBlockedUsers
}