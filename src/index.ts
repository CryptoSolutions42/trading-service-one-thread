import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { fork } from 'child_process';
import configRouter from './router/config.router';
import tradeSessionRouter from './router/trade-session';
import tradeOperationRouter from './router/trade-operation';
import balanceRouter from './router/balance.router';
import identityRouter from './router/instance-identity.router';
dotenv.config();

function startWorker() {
  const worker = fork('./build/worker.js');
  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
    startWorker();
  });
}

const app = express();
const port = +process.env.PORT!;

const prefix = {
  config: '/config',
  session: '/session',
  operation: '/operation',
  balance: '/balance',
  identity: '/identity',
};

app.use(bodyParser.json());
app.use(prefix.config, configRouter);
app.use(prefix.session, tradeSessionRouter);
app.use(prefix.operation, tradeOperationRouter);
app.use(prefix.balance, balanceRouter);
app.use(prefix.identity, identityRouter);

app.get('/status', (req, res) => {
  res.send({ status: 'Trading service is running' });
});

app.listen(port, () => console.log(`Trading service listening on port ${port}!`));
startWorker();

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
