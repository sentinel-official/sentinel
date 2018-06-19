import { Router } from 'express';

import * as TokenController from '../controllers/token.controller';

const routes = new Router();

routes.post('/', (req, res) => {
  res.status = 200;
  res.send({
    'status': 'UP'
  })
});

routes.get('/available', TokenController.getAvailableTokens);
routes.get('/sents', TokenController.getSents);
routes.post('/swaps/raw-transaction', TokenController.tokenSwapRawTransaction);

export default routes;