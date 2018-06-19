import joi from 'joi';
import * as utils from '../utils/validation';

export const getVpnCredentials = (req, res, next) => {
  let getVpnSchema = joi.object().keys({
    account_addr: joi.string().regex(/^0x[a-zA-Z0-9]{40}$/).required(),
    vpn_addr: joi.string().regex(/^0x[a-zA-Z0-9]{40}$/).required()
  })
  let validation = utils.validate(req.body, getVpnSchema);
  if (validation.isValid) {
    next();
  } else {
    res.status(422).send(validation);
  }
}

export const addVpnUsage = (req, res, next) => {
  let addVpnUsageSchema = joi.object().keys({
    from_addr: joi.string().required(),
    sent_bytes: joi.number().required(),
    session_duration: joi.string().required()
  })
  let validation = utils.validate(req.body, addVpnUsageSchema);
  if (validation.isValid) {
    next();
  } else {
    res.status(422).send(validation);
  }
}

export const payVpnUsage = (req, res, next) => {
  let payVpnUsageSchema = joi.object().keys({
    from_addr: joi.string().regex(/^0x[a-zA-Z0-9]{40}$/).required(),
    amount: joi.string().required(),
    session_id: joi.string().regex(/^0x[a-zA-Z0-9]{40}$/).required(),
    tx_data: joi.string().required()
  })
  let validation = utils.validate(req.body, payVpnUsageSchema);
  if (validation.isValid) {
    next();
  } else {
    res.status(422).send(validation);
  }
}