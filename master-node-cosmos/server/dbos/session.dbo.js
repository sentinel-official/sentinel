let SessionModel = require('../models/session.model');


let addSession = (details, cb) => {
  let session = new SessionModel(details);
  session.save((error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getSession = (findObj, cb) => {
  SessionModel.findOne(findObj, {
    _id: 0,
    token: 0
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let getSessions = (findObj, cb) => {
  SessionModel.find(findObj, {
    _id: 0,
    token: 0,
    addedOn: 0,
    updatedOn: 0
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result || []);
  });
};

let updateSession = (findObj, updateObj, cb) => {
  SessionModel.findOneAndUpdate(findObj, {
    $set: updateObj
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

let updateSessions = (findObj, updateObj, cb) => {
  SessionModel.updateMany(findObj, {
    $set: updateObj
  }, (error, result) => {
    if (error) cb(error);
    else cb(null, result);
  });
};

module.exports = {
  addSession,
  getSession,
  getSessions,
  updateSession,
  updateSessions
};