import Router, { Request, Response } from 'express';
import { SessionRepository } from '../repository/repository/session.repository';

const tradeSessionRouter = Router();
const tradeSessionRepo = new SessionRepository();

tradeSessionRouter.get(`/getActiveSession`, async (req: Request, res: Response) => {
  try {
    const result = await tradeSessionRepo.checkingActiveSession();
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
});

tradeSessionRouter.get(`/getAllProfitSession`, async (req: Request, res: Response) => {
  try {
    const result = await tradeSessionRepo.getAllProfitSession();
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
});

export default tradeSessionRouter;
