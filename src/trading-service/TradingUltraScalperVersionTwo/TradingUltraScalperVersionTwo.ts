import { Order } from 'ccxt';

import { ITrading } from '../../interfaces/ITrading';
import { CreateOpenPositionType } from '../../types/types';
import { AbstractTradingClass } from '../abstract.trading';

export class TradingUltraScalperVersionTwo extends AbstractTradingClass implements ITrading {
  constructor() {
    super();
  }

  /**
   * This method starting algorithm trading
   */
  async startAlgorithms(): Promise<void> {
    try {
      const ticker = await this._ExchangeService.getTick(this._SYMBOL);
      const price = ticker.last!;
      const settingStartOrder: CreateOpenPositionType = {
        symbol: this._SYMBOL,
        type: 'market',
        side: 'buy',
        amount: this._config.positionSize,
        price: price,
      };

      const startOrder: Order = await this._OrdersOperationService.createMarketOrLimitOrStopOrder(settingStartOrder);

      while (true) {
        let currentLoss = 0;
        const currentOrder = await this._OrdersOperationService.checkStatusOrderById(startOrder.id, this._SYMBOL);
        const unrealizedPnl = await this._ExchangeService.getUnrealizedPnl(
          this._SYMBOL,
          currentOrder.price,
          currentOrder.side,
        );

        if (unrealizedPnl > this._config.positionSize + 3) {
          const settingTakeProfit: CreateOpenPositionType = {
            symbol: currentOrder.symbol,
            type: 'market',
            side: currentOrder.side === 'buy' ? 'sell' : 'buy',
            amount: currentOrder.amount,
            price: currentOrder.price,
          };
          console.log('TakeProfit close position');
          await this._OrdersOperationService.createMarketOrLimitOrStopOrder(settingTakeProfit);
        }

        if (unrealizedPnl < -(this._config.positionSize + 3) || (currentLoss && unrealizedPnl < currentLoss)) {
          console.log('add valumes 0.1');
          currentLoss = unrealizedPnl;
          const settingStopLoss: CreateOpenPositionType = {
            symbol: currentOrder.symbol,
            type: 'market',
            side: currentOrder.side as 'buy' | 'sell',
            amount: 0.1,
            price: currentOrder.price,
          };
          await this._OrdersOperationService.createMarketOrLimitOrStopOrder(settingStopLoss);
        }
      }
    } catch (error: unknown) {
      const { message } = error as { message: string };
      console.log(`Error: ${message}`);
      await this._OrdersOperationService.cancelAllOrders(this._SYMBOL);
    }
  }

  /**
   * This method finishing algorithm trading
   */
  async endAlgorithms(): Promise<void> {
    await this._OrdersOperationService.cancelAllOrders(this._SYMBOL);
  }
}
