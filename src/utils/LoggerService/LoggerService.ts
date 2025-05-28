import axios from 'axios';
import { ILoggerService } from 'interfaces/ILoggerService';
import { LoggerType } from 'types/types';

export class LoggerService implements ILoggerService {
  private readonly GREEN_COLOR = '\x1b[32m';
  private readonly RED_COLOR = '\x1b[31m';
  private readonly ORANGE_COLOR = '\x1b[33m';
  private readonly TURQUOISE_COLOR = '\x1b[36m';
  private readonly RESET_COLOR = '\x1b[0m';

  constructor() {
    console.log('logger init');
  }

  private clearPreviousOutput() {
    process.stdout.write('\x1Bc');
  }

  private getColorBySide(side: string): string {
    return side === 'sell' ? this.ORANGE_COLOR : this.TURQUOISE_COLOR;
  }

  private getColorByPnL(pnl: number): string {
    return pnl > 0 ? this.GREEN_COLOR : this.RED_COLOR;
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
    this.clearPreviousOutput();
    const COLOR = this.getColorBySide(side);
    const HEADER_COLOR = this.getColorByPnL(unrealizedPnl);

    const logObject = {
      timestamp: new Date().toLocaleTimeString(),
      balance: balance.free,
      profitPrice: {
        price: profitPrice,
        amount: price * percentProfit + options.buyingBack * takerFee,
      },
      newBuyback: {
        buyBack: -(price * (percentBuyBackStep * options.drawdownStep)),
      },
      deltaForSale: side === 'sell' ? +deltaForSale : 'none',
      deltaForBuy: side === 'buy' ? +deltaForBuy : 'none',
      unrealizedPnl,
      lastPrice,
      options,
      orders: orders.flatMap((item) => ({ id: item.orderId ?? item.id, side: item.side })),
    };

    console.log(`${HEADER_COLOR}%s${this.RESET_COLOR}`, '\n=== Trading Service Logs ===');
    console.log(`${COLOR}%s${this.RESET_COLOR}`, JSON.stringify(logObject, null, 2));
    console.log(`${HEADER_COLOR}%s${this.RESET_COLOR}`, '===========================\n');

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
  }
}
