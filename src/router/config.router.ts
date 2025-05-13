import Router, { Request, Response } from 'express';
import { ConfigRepository } from '../repository/repository/config.repository';
import { ConfigType } from '../repository/types/types';

const configRouter = Router();
const configRepo = new ConfigRepository();

configRouter.get(`/getConfig`, async (req: Request, res: Response) => {
  try {
    const result = (await configRepo.getConfig()).flatMap((config) => {
      const { apiKey, privateKey, password, ...configMap } = config;
      return configMap;
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500);
  }
});

configRouter.post(`/updateConfig`, async (req: Request, res: Response) => {
  try {
    const config: Partial<ConfigType> = req.body;
    await configRepo.updateConfig(config);
    res.status(200).send('Config updated');
  } catch (error) {
    res.status(500);
  }
});

export default configRouter;
