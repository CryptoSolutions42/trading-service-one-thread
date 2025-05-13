import { parentPort } from 'worker_threads';
import { TradingVectorProfitService } from './trading-service/TradingVectorProfitService/TradingVectorProfitService';

const trading = new TradingVectorProfitService();

async function main() {
  try {
    await trading.startAlgorithms();
    parentPort?.postMessage('Algorithms started');
  } catch (err) {
    parentPort?.postMessage(`Error starting algorithms: ${err}`);
  }
}

main();
