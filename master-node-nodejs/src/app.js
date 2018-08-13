import eth from "./eth/eth";
import { stats } from './jobs/statistics';
import { alive } from './jobs/alive';
import { payments } from './jobs/payments';
import { swaps } from './jobs/swaps';

export const app = () => {
  stats('start')
  alive({ message: 'start', maxSecs: 60 })
  payments('start');
  swaps({ message: 'start' })
}