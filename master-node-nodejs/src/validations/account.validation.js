import joi from 'joi';
import utils from '../utils/validation';

const validateCreateAccount = (req, res, next) => {
  let createSchema = joi.object().keys({
    password: joi.string().required()
  })
  let validation = utils.validate(req.body, createSchema);
  if (validation.isValid) {
    next();
  } else {
    res.status(422).send(validation);
  }
}

const getBalance = (req, res, next) => {
  let getBalanceSchema = joi.object().keys({
    accountAddr: joi.string().regex(/^0x[a-zA-Z0-9]{40}$/).required()
  })
  let validation = utils.validate(req.body, getBalanceSchema);
  if (validation.isValid) {
    next();
  } else {
    res.status(422).send(validation);
  }
}

const rawTransaction = (req, res, next) => {
  let rawTransactionSchema = joi.object().keys({
    tx_data: joi.string().required()
  })
  let validation = utils.validate(req.body, rawTransactionSchema);
  if (validation.isValid) {
    next();
  } else {
    res.status(422).send(validation);
  }
}

export default {
  validateCreateAccount,
  getBalance,
  rawTransaction
}