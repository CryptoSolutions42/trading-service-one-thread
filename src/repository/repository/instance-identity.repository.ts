import { InstanceIdentityType, TableNameType } from 'repository/types/types';
import { AbstractRepository } from '../abstract.repository';

export class InstanceIdentityRepository extends AbstractRepository {
  private _tableName: TableNameType;
  private _columns: string[];

  constructor() {
    super();
    this._tableName = 'instance_identity';

    this._columns = [
      'copy_id as "copyId"',
      'create_at as "createAt"',
      'update_at as "updateAt"',
      'client_id as "clientId"',
    ];
  }

  async getInstance(): Promise<InstanceIdentityType> {
    const result = await this._selectQuery<InstanceIdentityType>({
      tableName: this._tableName,
      column: this._columns,
    });

    if (!result) {
      throw new Error('Instance not found!');
    }

    return result[0];
  }

  async createInstance(
    instance: Pick<InstanceIdentityType, 'clientId' | 'copyId'>,
  ): Promise<{ message: string } | undefined> {
    try {
      await this._insertQuery({
        tableName: this._tableName,
        value: this._mappingValuesList(instance),
      });

      return {
        message: 'Instance successfully created!',
      };
    } catch (error) {
      console.error(error);
    }
  }
}
