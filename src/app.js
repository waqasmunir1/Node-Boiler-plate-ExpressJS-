import express from 'express';
import chalk from 'chalk';
import { restRouter } from './base/index';
import { configureDb } from './config/db.js';
import { setGlobalmiddleware } from './middlewares/global-middleware';
import path from 'path';

configureDb();

const app = express();

app.use(express.static(path.join(__dirname, 'uploads/images')));

// REGISTER  GLOBAL MIDDLEWAREs
setGlobalmiddleware(app);
 
app.use('/', restRouter);

// handler the the UNAUTORIZED 
app.use('/failure', (req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid Authorization';
  error.status = 401;
  next(error);
});
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  // res.status(error.status || 500);
  return res.status(error.status || 500).json({
      message: error.message,
      status_code: error.status,
  });
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});