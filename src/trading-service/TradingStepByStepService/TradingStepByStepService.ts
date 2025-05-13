// import { Order, Ticker } from 'ccxt';

// import { Trading } from '../../interfaces/ITrading';
// import { ConfigType, ModeType } from '../../types/types';
// import { AbstractTradingClass } from '../abstract.trading';

// export class TradingStepByStepService extends AbstractTradingClass implements Trading {
//   constructor() {
//     super();
//     this._orders = [];
//   }

//   /**
//    * This method starting algorithm trading
//    */
//   async startAlgorithms(): Promise<void> {
//     const sideMode: ModeType[] = ['buy', 'sell'];

//     try {
//       const ticker = await this._AdditionExchangeService.getTicker(this._SYMBOL);
//       const price = ticker.last!;
//       const ohlc = await this._AdditionExchangeService.getOHLCVByTimeFrame(this._SYMBOL, '1d');

//       const prevDayOHLC = ohlc[ohlc.length - 1];
//       const highestInDays = prevDayOHLC[2];
//       const lowestInDays = prevDayOHLC[3];

//       console.log('ticker => ', ticker);
//       console.log('price => ', price);
//       console.log('prevDayOHLC => ', prevDayOHLC);
//       console.log('fiveDayHighest => ', highestInDays);
//       console.log('lowestInFiveDays => ', lowestInDays);

//       console.log('trade corridor => ', price < lowestInDays);
//       // console.log('hight => ', ohlc[ohlc.length - 2][2]);
//       // console.log('low => ', ohlc[ohlc.length - 2][3]);
//       // console.log('OHLCV => ', ohlc[ohlc.length - 2], new Date(ohlc[ohlc.length - 2][0]), ohlc[ohlc.length - 2][4]);

//       const settingForFirstOrder: {
//         symbol: string;
//         type: 'market' | 'limit';
//         amount: number;
//         price: number;
//       } = {
//         symbol: this._SYMBOL,
//         type: 'market',
//         amount: this._config.positionSize,
//         price: +price,
//       };

//       // диагностический инструмент для проверки операций условия ниже
//       // console.log('diagnostics buy and sell operation ... ${}')

//       if (price < lowestInDays) {
//         await this._openPositionForStrategy('sell', settingForFirstOrder);
//       } else if (price > highestInDays) {
//         await this._openPositionForStrategy('buy', settingForFirstOrder);
//       } else if (price > lowestInDays && price < highestInDays) {
//         const sellSide = price - lowestInDays;
//         const buySide = highestInDays - price;

//         if (buySide > sellSide) {
//           await this._openPositionForStrategy('sell', settingForFirstOrder);
//         } else {
//           await this._openPositionForStrategy('buy', settingForFirstOrder);
//         }
//       }

//       console.log('orders => ', this._orders);

//       while (true) {
//         break;
//       }
//     } catch (error: unknown) {
//       const { message } = error as { message: string };
//       console.log(`Error: ${message}`);
//       // await this._OrdersOperationService.cancelAllOrders(this._SYMBOL);
//     }
//   }

//   /**
//    * This method finishing algorithm trading
//    */
//   async endAlgorithms(): Promise<void> {
//     await this._OrdersOperationService.cancelAllOrders(this._SYMBOL);
//   }
// }
