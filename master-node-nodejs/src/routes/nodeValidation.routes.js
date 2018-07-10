import { Router } from "express";
import ValidationController from "../controllers/validation.controller";

let routes = new Router()

routes.get('/', (req, res) => {
  res.send({
    'status': 'Up'
  })
})

routes.post('/', (req, res) => {
  res.send({
    'status': 'Up'
  })
})

routes.get('/active', ValidationController.getActiveNodes);
routes.get('/blocked', ValidationController.getBlockedUsers);
routes.post('/count', ValidationController.updateCount);

export default routes