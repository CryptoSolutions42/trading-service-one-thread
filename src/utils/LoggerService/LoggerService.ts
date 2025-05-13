import axios from 'axios';
import { ILoggerService } from 'interfaces/ILoggerService';
import { LoggerType } from 'types/types';

export class LoggerService implements ILoggerService {
  constructor() {
    console.log('logger init');
  }

  public async loggerStrategy({
    _identity,
    balance,
    price,
    unrealizedPnl,
    lastPrice,
    side,
    profitPrice,
    percentProfit,
    percentBuyBackStep,
    takerFee,
    options,
    orders,
    deltaForSale,
    deltaForBuy,
  }: LoggerType) {
    console.log();
    console.log();
    console.log('==================================');
    console.log('balance =>', balance.free);
    console.log('profitPrice =>', { profitPrice, amount: price * percentProfit + options.buyingBack * takerFee });
    console.log('newBuyback => ', { buyBack: -(price * (percentBuyBackStep * options.drawdownStep)) });
    console.log('deltaForSale => ', { deltaForSale: side === 'sell' ? +deltaForSale : 'none' });
    console.log('deltaForBuy => ', { deltaForBuy: side === 'buy' ? +deltaForBuy : 'none' });
    console.log('unrealizedPnl => ', { unrealizedPnl });
    console.log('lastPrice => ', { lastPrice });
    console.log('options => ', { options });
    console.log(
      'orders => ',
      orders.flatMap((item) => ({ id: item.orderId ?? item.id, side: item.side })),
    );
    console.log('==================================');
    console.log();
    console.log();

    // await axios.post(
    //   'http://localhost:5020/logger',
    //   {
    //     ident: _identity,
    //     product: _identity,
    //     log: {
    //       balance,
    //       price,
    //       unrealizedPnl,
    //       lastPrice,
    //       side,
    //       profitPrice,
    //       percentProfit,
    //       percentBuyBackStep,
    //       takerFee,
    //       options,
    //       orders,
    //       deltaForSale,
    //       deltaForBuy,
    //     },
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );
    console.log(`${_identity}`);
  }
}
