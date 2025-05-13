// import { Order, Ticker } from 'ccxt';

// import { ITrading } from '../../interfaces/ITrading';
// import { ModeType } from '../../types/types';
// import { AbstractTradingClass } from '../../services/abstract.trading';

// export class TradingUltraScalperService extends AbstractTradingClass implements ITrading {
//   constructor(symbol: string, exchange: string) {
//     super(symbol, exchange);
//   }

//   /**
//    * This method starting algorithm trading
//    */
//   async startAlgorithms(): Promise<void> {
//     try {
//       const sideMode: ModeType[] = ['buy', 'sell'];
//       const ticker: Ticker = await this._ExchangeService.getTick(this._SYMBOL);
//       console.log('ticker => ', ticker);

//       const paramOpenPositionForAlgorithm = {
//         ticker,
//         positionSize: this._config.positionSize,
//         gridSize: this._config.gridSize,
//         numberGridLines: this._config.countGridSize,
//       };

//       for (const side of sideMode) {
//         this._orders.push(
//           ...(await this._OrdersOperationService.openPositionForAlgorithm({
//             ...paramOpenPositionForAlgorithm,
//             side,
//             symbol: this._SYMBOL,
//             amount: this._config.positionSize,
//             price: ticker.price,
//             type: 'market',
//           })),
//         );
//       }

//       while (true) {
//         for (const order of this._orders) {
//           const resultChecking =
//             await this._OrdersCheckingService.checkWhichOrderActivatedHowPositionsClosedWaitingResult({
//               symbol: this._SYMBOL,
//               positionSize: this._config.positionSize,
//               order: order,
//               takeProfit: this._config.takeProfit!,
//               stopLoss: this._config.stopLoss!,
//             });

//           if (resultChecking) {
//             await this._clearingOrderList();
//             this.startAlgorithms();
//           }
//         }

//         await this._sleepTimeout(2000);
//       }
//     } catch (error: unknown) {
//       const { message } = error as { message: string };
//       console.log(`Error: ${message}`);
//       await this._OrdersOperationService.cancelAllOrders(this._SYMBOL);
//     }
//   }

//   /**
//    * This method finishing algorithm trading
//    */
//   async endAlgorithms(): Promise<void> {
//     await this._OrdersOperationService.cancelAllOrders(this._SYMBOL);
//   }
// }
