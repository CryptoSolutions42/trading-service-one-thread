import { Order } from 'ccxt';

import { ConfigType, OrderType, SessionType } from 'repository/types/types';
import { BalanceType } from 'types/types';
import { ExchangeService } from '../ExchangeService/ExchangeService';
import { BalanceRepository } from '../../repository/repository/balance.repository';
import { SessionRepository } from '../../repository/repository/session.repository';
import { IExchangeService, IOrdersOperationService, ISessionTradingService } from 'interfaces';
import { OrdersOperationService } from '../../utils/OrdersOperationService/OrdersOperationService';

export class SessionTradingService implements ISessionTradingService {
  private _exchange: string;
  private _symbol: string;

  private _OrdersOperationService: IOrdersOperationService;
  private _ExchangeService: IExchangeService;
  private _SessionsRepository: SessionRepository;
  private _BalanceRepository: BalanceRepository;

  constructor(config: ConfigType) {
    const { exchange, apiKey, privateKey, password, symbol } = config;
    this._exchange = exchange;
    this._symbol = symbol;
    this._ExchangeService = new ExchangeService(exchange, apiKey, privateKey, password);
    this._OrdersOperationService = new OrdersOperationService(config);
    this._SessionsRepository = new SessionRepository();
    this._BalanceRepository = new BalanceRepository();
  }

  public async initTradeSession(): Promise<{ typeSession: string; indexOperation: string }> {
    // TODO: Продумать вариант ожидания не исполненного ордера
    // await this._checkingIfThereOpenOrders();
    let indexOperation: string;
    const isActiveOldSession = await this._checkingActiveSession();
    console.log('_initTradeSession => ', isActiveOldSession);
    if (isActiveOldSession === undefined || !isActiveOldSession) {
      indexOperation = await this._SessionsRepository.startSession();
      return { typeSession: 'startNewTrade', indexOperation };
    }

    const orders: OrderType[] | undefined = await this._OrdersOperationService.getAllOrdersByIndexOperation(
      isActiveOldSession.indexSession,
    );

    indexOperation = isActiveOldSession.indexSession;

    if (!orders?.length) {
      return { typeSession: 'startNewTrade', indexOperation };
    }

    await this._checkingIfClosingOrderHasBeenCreated(orders, indexOperation);
    await this._OrdersOperationService.setOrders(orders);
    return { typeSession: 'startOldTrade', indexOperation };
  }

  public async calculateProfitSession(indexOperation: string, orders: Order[]): Promise<number> {
    const calculateProfitSession = await this._OrdersOperationService.getProfitForTradeSession(
      indexOperation,
      orders[orders.length - 1].side,
      orders,
    );

    return calculateProfitSession;
  }

  public async saveBalanceState(calculateProfitSession: number, orders: Order[]): Promise<BalanceType | undefined> {
    const balance = await this._ExchangeService.getBalance();
    const isExisting = await this._BalanceRepository.getBalance();

    if (orders.length === 0) {
      return;
    }
    console.log('_saveBalanceState => ', isExisting);

    if (!isExisting) {
      await this._BalanceRepository.createStateBalance({
        usdt: balance['USDT'].free,
        profitAll: 0,
        exchangeName: this._exchange,
        profitUsdt: 0,
        balanceObject: JSON.stringify(balance),
      });

      return;
    }

    const allProfitSession = await this._SessionsRepository.getAllProfitSession();
    console.log('_saveBalanceState => ', allProfitSession);
    console.log('ОБЪЕКТ БАЛАНСА => ', {
      usdt: balance.USDT.free,
      profitAll: allProfitSession,
      profitUsdt: orders[0].side === 'buy' ? calculateProfitSession : 0,
      balanceObject: JSON.stringify(balance),
    });
    const prevBalance = await this._BalanceRepository.getBalance();
    await this._BalanceRepository.createStateBalance({
      usdt: balance.USDT.free,
      profitAll: allProfitSession ?? 0,
      exchangeName: this._exchange,
      profitUsdt: prevBalance ? (prevBalance.profitUsdt + orders[0].side === 'buy' ? calculateProfitSession : 0) : 0,
      balanceObject: JSON.stringify(balance),
    });

    return balance;
  }

  public async endTradeSession(calculateProfitSession: number, indexOperation: string): Promise<void> {
    await this._SessionsRepository.endTradeSession(calculateProfitSession, indexOperation);
  }

  private async _checkingActiveSession(): Promise<SessionType | undefined> {
    const result = await this._SessionsRepository.checkingActiveSession();

    return result;
  }
  // TODO: Необходим рефакторинг - утилитарный класс для подобного рода операций.
  private async _checkingIfClosingOrderHasBeenCreated(orders: OrderType[], indexSession: string): Promise<void> {
    orders.find(async (order) => {
      if (orders[0].side !== order.side) {
        const calculationProfit = await this.calculateProfitSession(indexSession, orders);
        await this.saveBalanceState(calculationProfit, orders);
        await this.endTradeSession(calculationProfit, indexSession);
        await this._OrdersOperationService.revertActiveStateOrder(indexSession);
        await this._OrdersOperationService.clearingOrderList();
        throw new Error('The completed session was initialized!');
      }
    });
  }

  private async _checkingIfThereOpenOrders() {
    let orenOrders = await this._ExchangeService.getOpenOrders(this._symbol);

    while (orenOrders.length !== 0) {
      await this._sleepTimeout(5000);
      orenOrders = await this._ExchangeService.getOpenOrders(this._symbol);
    }
  }

  private async _sleepTimeout(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
