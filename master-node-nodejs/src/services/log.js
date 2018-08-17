/**
 * Error handler for api routes
 */

import Raven from 'raven';
import PrettyError from 'pretty-error';
import HTTPStatus from 'http-status';

import constants from '../config/constants';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

export default function logErrorService(err, req, res, next) {
  if (!err) {
    return {
      message:'Error with the server!',
      error:HTTPStatus.INTERNAL_SERVER_ERROR,
    }
  }

  if (isProd) {
    const raven = new Raven.Client(constants.RAVEN_ID);
    raven.captureException(err);
  }

  if (isDev) {
    const raven = new Raven.Client(constants.RAVEN_ID);
    raven.captureException(err);
  }

  const error = {
    message: err.message || 'Internal Server Error.',
  };

  if (err.errors) {
    error.errors = {};
    const { errors } = err;
    if (Array.isArray(errors)) {
      error.errors = RequiredError.makePretty(errors);
    } else {
      Object.keys(errors).forEach(key => {
        error.errors[key] = errors[key].message;
      });
    }
  }

  res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR).json(error);

  return next();
}
