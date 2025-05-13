import { Order } from 'ccxt';

import { SettingCheckingEmergencyStopParam } from 'types/types';

export interface IEmergencyStopService {
  emergencyDisableProcess: (param: SettingCheckingEmergencyStopParam) => Promise<true | undefined>;
  checkingIsEmergencyStop: (closeAllAmount: () => Promise<Order>) => Promise<true | undefined>;
  toggleIsEmergencyStop: () => Promise<boolean>;
}
