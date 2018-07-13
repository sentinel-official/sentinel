import { Router } from 'express'
import swixerController from '../controllers/swixer.controller';


let routes = Router()

routes.get('/', (req, res) => {
  res.status(200).send({
    'status': 'Up'
  })
});


routes.post('/', swixerController.getSwixDetails);
routes.get('/rate', swixerController.getExchangeValue);
routes.get('/list', swixerController.getSwixerNodesList);
routes.get('/status', swixerController.getSwixStatus);
routes.post('/register', swixerController.registerSwixerNode);
routes.post('/deregister', swixerController.deRegisterSwixerNode);
routes.post('/update-nodeinfo', swixerController.updateSwixerNodeInfo)

export default routes