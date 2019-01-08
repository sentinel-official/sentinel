let NodeModel = require('../models/node.model');


let addNode = (details, cb) => {
  let node = new NodeModel(details);
  node.save((error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getNode = (findObj, cb) => {
  NodeModel.findOne(findObj, {
    '_id': 0
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getNodes = (findObj, cb) => {
  NodeModel.find(findObj, {
    '_id': 0,
    'addedOn': 0,
    'lastOn': 0,
    'statusOn': 0,
    'status': 0,
    'token': 0
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result || []);
  });
};

let updateNode = (findObj, updateObj, cb) => {
  NodeModel.findOneAndUpdate(findObj, {
    $set: updateObj
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let updateNodes = (findObj, updateObj, cb) => {
  NodeModel.updateMany(findObj, {
    $set: updateObj
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

module.exports = {
  addNode,
  getNode,
  getNodes,
  updateNode,
  updateNodes
};