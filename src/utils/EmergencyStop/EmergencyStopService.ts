import { Order } from 'ccxt';
import { ConfigRepository } from '../../repository/repository/config.repository';
import { SettingCheckingEmergencyStopParam } from 'types/types';

export class EmergencyStopService {
  private _ConfigRepository: ConfigRepository;

  constructor() {
    this._ConfigRepository = new ConfigRepository();
  }

  public async emergencyDisableProcess({
    isEmergencyStop,
    closeAllAmount,
  }: SettingCheckingEmergencyStopParam): Promise<true | undefined> {
    if (!isEmergencyStop) {
      return;
    }

    await closeAllAmount();
    await this._disabledEmergencyStop();
    return true;
  }

  public async checkingIsEmergencyStop(closeAllAmount: () => Promise<Order>): Promise<true | undefined> {
    try {
      const isEmergencyStop = await this.toggleIsEmergencyStop();
      const result = await this.emergencyDisableProcess({ isEmergencyStop, closeAllAmount });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  public async toggleIsEmergencyStop(): Promise<boolean> {
    const { isEmergencyStop } = await this._ConfigRepository.getEmergencyStop();
    console.log('_getIsEmergencyStop => ', isEmergencyStop);
    return isEmergencyStop;
  }

  private async _disabledEmergencyStop(): Promise<void> {
    await this._ConfigRepository.disableEmergencyStop();
  }
}
