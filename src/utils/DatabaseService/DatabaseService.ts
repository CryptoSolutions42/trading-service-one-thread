import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export class DatabaseService {
  public _db: Pool;
  constructor() {
    this._db = new Pool({
      database: process.env.TRADING_DB!,
      host: process.env.TRADING_HOST!,
      port: +process.env.TRADING_PORT!,
      user: process.env.TRADING_USER!,
      password: process.env.TRADING_PASSWORD!,
    });
  }
}
