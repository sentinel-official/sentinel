import { Router } from 'express';

import AccountController from '../controllers/account.controller';
import VpnController from '../controllers/vpn.controller';
import TransactionController from '../controllers/transactions';

const routes = new Router();

routes.post('/account', AccountController.createAccount);
routes.post('/account/balance', AccountController.getBalance);
routes.post('/raw-transaction', TransactionController.rawTransaction);
routes.post('/vpn', VpnController.getVpnCredentials);
routes.post('/vpn/current', VpnController.getCurrentVpnUsage);
routes.get('/vpn/list', VpnController.getVpnsList);
routes.get('/vpn/socks-list', VpnController.getSocksList);
routes.post('/vpn/usage', VpnController.getVpnUsage);
routes.post('/vpn/pay', VpnController.payVpnUsage);
routes.post('/vpn/report', VpnController.reportPayment);
routes.post('/update-connection', VpnController.updateConnection);

export default routes;