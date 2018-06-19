import { Router } from 'express';
import * as NodeController from '../controllers/node.controller';
import * as AccountController from '../controllers/account.controller';
import * as VpnController from '../controllers/vpn.controller';
import * as VpnValidations from '../validations/vpn.validation';

const routes = new Router();

routes.post('/account', AccountController.createAccount);
routes.post('/account/balance', AccountController.getBalance);
routes.post('/register', NodeController.registerNode);
routes.post('/update-nodeinfo', NodeController.updateNodeInfo);
routes.post('/deregister', NodeController.deRegisterNode);
routes.post('/update-connections', NodeController.updateConnections);

export default routes;