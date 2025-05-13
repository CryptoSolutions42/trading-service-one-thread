import Router, { Request, Response } from 'express';
import { OrderRepository } from '../repository/repository/order.repository';

const tradeOperationRouter = Router();
const tradeOperationRepo = new OrderRepository();

tradeOperationRouter.get(`/getAllActiveOrders`, async (req: Request, res: Response) => {
  try {
    const result = await tradeOperationRepo.getAllActiveOrders();
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
});

tradeOperationRouter.get(`/getAllOrdersByIndexOperation`, async (req: Request, res: Response) => {
  try {
    const indexOperation = req.params.indexOperation;
    const result = await tradeOperationRepo.getAllOrdersByIndexOperation(indexOperation);
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
});

export default tradeOperationRouter;
