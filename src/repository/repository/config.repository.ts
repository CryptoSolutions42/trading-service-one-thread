import { AbstractRepository } from '../abstract.repository';
import { ConfigType, TableNameType } from '../types/types';

export class ConfigRepository extends AbstractRepository {
  private tableName: TableNameType = 'trade_config';
  constructor() {
    super();
  }

  async getConfig(): Promise<ConfigType[]> {
    const result = await this._selectQuery<ConfigType>({
      tableName: this.tableName,
      column: [
        'position_size as "positionSize"',
        'count_grid_size as "countGridSize"',
        'grid_size as "gridSize"',
        'percent_buy_back as "percentBuyBackStep"',
        'take_profit as "takeProfit"',
        'stop_loss as "stopLoss"',
        'is_emergency_stop as "isEmergencyStop"',
        'is_fibonacci as "isFibonacci"',
        'percent_profit as "percentProfit"',
        'percent_from_balance as "percentFromBalance"',
        'candle_price_range as "candlePriceRange"',
        'percent_target_after_take_profit as "percentTargetAfterTakeProfit"',
        'is_percent_target_after_take_profit as "isPercentTargetAfterTakeProfit"',
        'is_capitalize_delta_from_sale as "isCapitalizeDeltaFromSale"',
        'is_coin_accumulation as "isCoinAccumulation"',
        'is_only_buy as "isOnlyBuy"',
        'logger_event as "loggerEvent"',
        'api_key as "apiKey"',
        'private_key as "privateKey"',
        'password',
        'exchange',
        'symbol',
      ],
    });

    if (!result) {
      throw new Error('Config not found - you need create config in database!');
    }

    result.flatMap((config) => {
      config.apiKey = this._encryptionService.decrypt(config.apiKey);
      config.privateKey = this._encryptionService.decrypt(config.privateKey);
      config.password = this._encryptionService.decrypt(config.password);
    });

    return result ?? ({} as ConfigType);
  }

  async getEmergencyStop(): Promise<{ isEmergencyStop: boolean }> {
    const result = await this._selectQuery<{ isEmergencyStop: boolean }>({
      tableName: this.tableName,
      column: ['is_emergency_stop as "isEmergencyStop"'],
    });

    if (!result) {
      throw new Error('Config is not found!');
    }

    return result[0];
  }

  async enableEmergencyStop(): Promise<void> {
    await this._updateQuery({
      tableName: this.tableName,
      value: [{ column: 'is_emergency_stop', value: 1 }],
    });
  }

  async disableEmergencyStop(): Promise<void> {
    await this._updateQuery({
      tableName: this.tableName,
      value: [{ column: 'is_emergency_stop', value: 0 }],
    });
  }

  async recordLogger(loggerEvent: string): Promise<void> {
    await this._updateQuery({
      tableName: this.tableName,
      value: [
        {
          column: 'logger_event',
          value: loggerEvent,
        },
      ],
    });
  }

  async updateConfig(config: Partial<ConfigType>) {
    console.log('updateConfig');
    const { apiKey, privateKey, password, ...configTemp } = config;
    console.log('updateConfig', { apiKey, privateKey, password });

    const configMapping: { [key: string]: any } = {};

    if (apiKey) {
      configMapping.apiKey = this._encryptionService.encrypt(apiKey);
      console.log('configMapping.apiKey', configMapping.apiKey);
    }
    if (privateKey) {
      configMapping.privateKey = this._encryptionService.encrypt(privateKey);
      console.log('configMapping.privateKey', configMapping.privateKey);
    }
    if (password) {
      configMapping.password = this._encryptionService.encrypt(password);
      console.log('configMapping.password', configMapping.password);
    }

    await this._updateQuery({
      tableName: this.tableName,
      value: this._mappingValuesList({
        ...configMapping,
        ...configTemp,
      }),
    });
  }
}
