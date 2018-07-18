/* eslint-disable no-console */
/**
 * Server setup
 */
import express from 'express';
import chalk from 'chalk';
import RateLimit from 'express-rate-limit';

import middlewaresConfig from './config/middlewares';
import constants from './config/constants';
import ApiRoutes from './routes';

import { dbo } from './db/database'

dbo()

let limiter = new RateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 200, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  message: "Too many requests maid from this IP, please try again after an hour"
});

const app = express();

// Wrap all the middlewares with the server
middlewaresConfig(app);

app.enable('trust proxy');
app.use(limiter);

// Add the apiRoutes stack to the server
if (process.env.NODE_ENV !== 'test') app.use(ApiRoutes);
else app.use('/api', ApiRoutes)
// We need this to make sure we don't run a second instance
if (!module.parent) {
  app.listen(constants.PORT, err => {
    if (err) {
      console.log(chalk.red('Cannot run!'));
    } else {
      console.log(
        chalk.green.bold(
          `
        Yep this is working 🍺
        App listen on port: ${constants.PORT} 🍕
        Env: ${process.env.NODE_ENV} 🦄
      `,
        ),
      );
    }
  });
}

export default app;
