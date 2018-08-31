import { Router } from 'express';
import NodeController from '../controllers/node.controller'

const routes = new Router();

routes.get('/sessions/daily-stats', NodeController.getDailySessionCount);
routes.get('/sessions/active-count', NodeController.getActiveSessionCount);
routes.get('/sessions/average-count', NodeController.getAverageSessionsCount);
routes.get('/nodes/total-nodes', NodeController.getTotalNodeCount);
routes.get('/nodes/daily-active', NodeController.getDailyActiveNodeCount);
routes.get('/nodes/average-nodes', NodeController.getAverageNodesCount);
routes.get('/nodes/daily-stats', NodeController.getDailyNodeCount);
routes.get('/nodes/active-count', NodeController.getActiveNodeCount);
routes.get('/data/daily-stats', NodeController.getDailyDataCount);
routes.get('/data/total-data', NodeController.getTotalDataCount);
routes.get('/data/last-data', NodeController.getLastDataCount);
routes.get('/time/daily-stats', NodeController.getDailyDurationCount);
routes.get('/time/average-duration', NodeController.getAverageDuration);
routes.get('/time/average-daily', NodeController.getDailyAverageDuration);
routes.get('/time/last-average', NodeController.getLastAverageDuration);
routes.get('/payment/paid-sents-count', NodeController.getDailyPaidSentsCount);
routes.get('/payment/total-sents-used', NodeController.getDailyTotalSentsUsed);
routes.get('/payment/average-paid-sents', NodeController.getAveragePaidSentsCount);
routes.get('/payment/average-total-sents', NodeController.getAverageTotalSentsCount);
routes.get('/node', NodeController.getNodeStatistics);

export default routes;