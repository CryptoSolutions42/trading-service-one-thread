// import { ITrading } from '../../interfaces/ITrading';
// import { AbstractTradingClass } from '../../services/abstract.trading';
// import { BalanceType, SettingOrderType, WatchingProcessParamType } from '../../types/types';

// export class TradingHighFrequency extends AbstractTradingClass implements ITrading {
//   constructor(symbol: string, exchange: string) {
//     super(symbol, exchange);
//   }

//   async startAlgorithms(): Promise<void> {
//     try {
//       await this._startTradingSession({
//         typeTrading: 'one-trade',
//       });
//     } catch (error: unknown) {
//       const { message } = error as { message: string };
//       console.log(
//         `
//           ${error}
//           ${message}
//         `,
//       );
//     }
//   }

//   async endAlgorithms(): Promise<void> {
//     await this._OrdersOperationService.cancelAllOrders(this._SYMBOL);
//   }

//   //   private async _watchingTakeProfitLogic() {}

//   private async _watchingTakeProfitLogic({ settingForFirstOrder, firstOrder, price }: WatchingProcessParamType) {
//     let isNextTrading = false;
//     const options = {
//       buyingBack: +settingForFirstOrder.amount,
//       drawdownStep: this._OrdersOperationService.orders.length ?? 1,
//     };

//     while (this._OrdersOperationService.orders.length !== 0) {
//       const balance: BalanceType = await this._ExchangeService.getBalance();
//       const side = this._OrdersOperationService.orders[this._OrdersOperationService.orders.length - 1].side;
//       const unrealizedPnl = await this._ExchangeService.getUnrealizedPnl(
//         this._SYMBOL,
//         settingForFirstOrder.price,
//         firstOrder.side,
//       );
//       const profitPrice =
//         price +
//         (firstOrder.side === 'sell'
//           ? -(price * this._config.percentProfit + options.buyingBack * this._takerFee)
//           : price * this._config.percentProfit + options.buyingBack * this._takerFee);
//       const settingTakeProfit: SettingOrderType = { ...settingForFirstOrder };
//       const lastPrice = await this._ExchangeService.getPrice(this._SYMBOL);

//       if (isNextTrading) {
//         symbol: this._SYMBOL,
//           this._openPositionForStrategy({
//             side: 'buy',
//             settingOrder: {
//               symbol: this._SYMBOL,
//               type: 'limit',
//               amount: this._config.positionSize,
//               price: lastPrice,
//             },
//           });
//         return;
//       }

//       //   const isStop = await this._EmergencyStopService.checkingIsEmergencyStop({
//       //     side,
//       //     settingTakeProfit,
//       //     lastPrice,
//       //     buyingBack: options.buyingBack,
//       //   });

//       //   if (isStop) {
//       //     break;
//       //   }

//       this._loggerStrategy({ balance, price, options, unrealizedPnl, lastPrice, side, profitPrice });

//       if (unrealizedPnl >= price * this._config.percentProfit + options.buyingBack * this._takerFee) {
//         await this._openPositionForStrategy({
//           side: side === 'sell' ? 'buy' : 'sell',
//           settingOrder: {
//             ...settingTakeProfit,
//             price: lastPrice,
//             amount: options.buyingBack,
//           },
//         });
//         console.log('======> TakeProfit close all positions!');
//         await this._OrdersOperationService.clearingOrderList();
//         isNextTrading = true;
//       }

//       await this._sleepTimeout(1000);
//     }
//   }

//   private _loggerStrategy({ balance, price, options, unrealizedPnl, lastPrice, side, profitPrice }) {
//     console.log();
//     console.log();
//     console.log('==================================');
//     console.log('balance =>', balance.free);
//     console.log(
//       'profitPrice =>',
//       profitPrice,
//       price * this._config.percentProfit + options.buyingBack * this._takerFee,
//     );
//     console.log(
//       'amountForBuyBack =>',
//       balance[side === 'sell' ? 'ETH' : 'USDT'].free * this._config.percentFromBalance,
//     );
//     console.log('newBuyback => ', { buyBack: -(price * (this._config.percentBuyBackStep * options.drawdownStep)) });
//     console.log('take profit price and target => ', {
//       price: price * this._config.percentProfit,
//       targetProfit: profitPrice,
//     });
//     console.log('unrealizedPnl => ', unrealizedPnl);
//     console.log('lastPrice => ', lastPrice);
//     console.log('options => ', options);
//     console.log(
//       'orders => ',
//       this._OrdersOperationService.orders.flatMap((item) => ({ id: item.id, side: item.side })),
//     );
//     console.log('==================================');
//     console.log();
//     console.log();
//   }
// }
