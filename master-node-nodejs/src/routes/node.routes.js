import { Router } from 'express';
import NodeController from '../controllers/node.controller';
import AccountController from '../controllers/account.controller';

const routes = new Router();

routes.post('/account', AccountController.createAccount);
routes.post('/account/balance', AccountController.getBalance);
routes.post('/register', NodeController.registerNode);
routes.post('/update-nodeinfo', NodeController.updateNodeInfo);
routes.post('/deregister', NodeController.deRegisterNode);
routes.post('/update-connections', NodeController.updateConnections);

export default routes;