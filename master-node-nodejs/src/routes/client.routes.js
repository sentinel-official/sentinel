import { Router } from 'express';

import * as AccountController from '../controllers/account.controller';
import * as VpnController from '../controllers/vpn.controller';
import * as TransactionController from '../controllers/transactions';
import * as AccountValidations from '../validations/account.validation';
import * as VpnValidations from '../validations/vpn.validation';

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