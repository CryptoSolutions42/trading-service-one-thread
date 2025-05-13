// import { Order, Ticker } from 'ccxt';

// import { CheckingOrdersType, ModeType } from '../../types/types';
// import { ITrading } from '../../interfaces/ITrading';
// import { AbstractTradingClass } from 'trading-service/abstract.trading';
// // import { Utils } from 'utils/Utils';

// export class TradingScalperService extends AbstractTradingClass implements ITrading {
//   constructor(symbol: string, exchange: string) {
//     super(symbol, exchange);
//   }

//   /**
//    *  @description Method start algorithm trading
//    */
//   async startAlgorithms(): Promise<void> {
//     const sideMode: ModeType[] = ['buy', 'sell'];

//     //TODO: solution problem with variable checkingOrders before settings tsconfig
//     const checkingOrders: CheckingOrdersType[] = [];
//     const checkingOrdersFirst: CheckingOrdersType = checkingOrders[0];

//     const ordersOpen: {
//       buyOrders: Order[];
//       sellOrders: Order[];
//     } = {
//       buyOrders: [],
//       sellOrders: [],
//     };

//     const ticker: Ticker = await this._ExchangeService.getTick(this._SYMBOL);
//     console.log('ticker => ', ticker);

//     const paramsOpenLimitPosition = {
//       ticker,
//       positionSize: this._config.positionSize,
//       gridSize: this._config.gridSize!,
//       numberGridLines: this._config.countGridSize!,
//     };

//     for (const side of sideMode) {
//       ordersOpen[`${side}Orders`].push(
//         ...(await this._openLimitPosition({
//           ...paramsOpenLimitPosition,
//           side,
//         })),
//       );
//     }
// §
//     while (true) {
//       const closedOrderIds: string[] = [];

//       for (const key in checkingOrdersFirst) {
//         checkingOrdersFirst[key] =
//           await this._OrdersCheckingService.checkingOrdersWhenOrderStatusCloseCreateNewOrderForLiqudationOpenPositionsOnExchange(
//             {
//               mode: key === 'checkingBuyOrders' ? 'buy' : 'sell',
//               symbol: this._SYMBOL,
//               positionSize: this._config.positionSize,
//               gridSize: this._config.gridSize!,
//               ordersForChecking: key === 'checkingBuyOrders' ? ordersOpen.buyOrders : ordersOpen.sellOrders,
//             },
//           );
//       }

//       for (const side of sideMode) {
//         ordersOpen[`${side}Orders`].push(
//           ...checkingOrdersFirst[`checking${Utils.returnStringWithUpperLetter(side)}Orders`].orders,
//         );
//         closedOrderIds.push(
//           ...checkingOrdersFirst[`checking${Utils.returnStringWithUpperLetter(side)}Orders`].closedOrderIds,
//         );
//       }

//       closedOrderIds.forEach((closedOrderId) => {
//         for (const side of sideMode) {
//           ordersOpen[`${side}Orders`] = ordersOpen[`${side}Orders`].filter((order) => order.id !== closedOrderId);
//         }
//       });

//       if (ordersOpen.sellOrders.length === 0 && ordersOpen.buyOrders.length === 0 && closedOrderIds.length > 0) {
//         console.log('nothing left to sell, exiting');
//         this.endAlgorithms();
//       }
//     }
//   }

//   /**
//    *  @description Method end algorithm trading
//    */
//   async endAlgorithms(): Promise<void> {
//     await this._OrdersOperationService.cancelAllOrders(this._SYMBOL);
//   }
// }
