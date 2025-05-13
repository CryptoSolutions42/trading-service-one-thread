import Router, { Request, Response } from 'express';
import { BalanceRepository } from '../repository/repository/balance.repository';

const balanceRouter = Router();
const balanceRepo = new BalanceRepository();

balanceRouter.get(`/getBalance`, async (req: Request, res: Response) => {
  try {
    const result = await balanceRepo.getBalance();
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
});

export default balanceRouter;
