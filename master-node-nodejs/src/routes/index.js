/**
 * API Routes
 */

import { Router } from 'express';
import HTTPStatus from 'http-status';

import NodeRoutes from './node.routes';
import ClientRoutes from './client.routes';
import StatsRoutes from './stats.routes';
import TokenRoutes from './token.routes';
import db from '../db/db'
import { app } from '../app'

import * as DevController from '../dev/free'
import * as ErrorController from '../controllers/error.controller'

import * as config from '../utils/config'

// Middlewares
import logErrorService from '../services/log';

const routes = new Router();

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

if (!isTest)
  app();

routes.get('/', (req, res) => {
  res.status = 200
  res.send({
    'status': 'UP'
  })
})

routes.post('/', (req, res) => {
  res.status(200).send({
    'status': 'UP'
  })
})

routes.use('/client', ClientRoutes);
routes.use('/node', NodeRoutes);
routes.use('/stats', StatsRoutes);
routes.use('/tokens', TokenRoutes);

routes.post('/logs/error', ErrorController.logTheError);
routes.post('/dev/free', DevController.getFreeAmount);

routes.all('*', (req, res, next) => {
  console.log('404 api not found')
  next()
});

routes.use(logErrorService);

export default routes;
