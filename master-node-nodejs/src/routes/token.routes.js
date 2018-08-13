import { Router } from 'express';
import TokenController from '../controllers/token.controller';

const routes = new Router();

routes.post('/', (req, res) => {
  res.status(200).send({
    'status': 'UP'
  })
});

routes.get('/', (req, res) => {
  res.status(200).send({
    'status': 'UP'
  })
});

routes.get('/available', TokenController.getAvailableTokens);
routes.get('/exchange', TokenController.getExchangeValue);
routes.post('/raw-transaction', TokenController.tokenSwapRawTransaction);
routes.get('/status', TokenController.swapStatus);
routes.post('/new-address', TokenController.getNewAddress);
routes.get('/pending', TokenController.getPendingTransactions);

export default routes; 