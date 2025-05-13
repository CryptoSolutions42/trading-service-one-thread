import Router, { Request, Response } from 'express';
import { InstanceIdentityRepository } from '../repository/repository/instance-identity.repository';

const identityRouter = Router();
const identityRepo = new InstanceIdentityRepository();

identityRouter.get(`/getInstance`, async (req: Request, res: Response) => {
  try {
    const result = await identityRepo.getInstance();
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
});

identityRouter.post(`/createInstance`, async (req: Request, res: Response) => {
  try {
    const instance = req.body;
    const result = await identityRepo.createInstance(instance);
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
});

export default identityRouter;
