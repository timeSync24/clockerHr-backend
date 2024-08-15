// src/controllers/DirectDepositController.ts
import { Request, Response, NextFunction } from 'express';
import DirectDepositService from '../services/DirectDepositService';
import { TokenPayload } from '../types/token';
import { Types } from 'mongoose';

class DirectDepositController {
    async createDirectDeposit(req: Request, res: Response, next: NextFunction) {
        try {
          if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
          
          const userId = new Types.ObjectId(req.user._id);
          const deposit = await DirectDepositService.createDirectDeposit(req.body, userId);
          res.status(201).json(deposit);
        } catch (error) {
          next(error);
        }
      }

  async getDirectDepositsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const deposits = await DirectDepositService.getDirectDepositsByCompany(new Types.ObjectId(req.params.companyId));
      res.status(200).json(deposits);
    } catch (error) {
      next(error);
    }
  }

  async getDirectDepositById(req: Request, res: Response, next: NextFunction) {
    try {
      const deposit = await DirectDepositService.getDirectDepositById(new Types.ObjectId(req.params.companyId), new Types.ObjectId(req.params.directDepositId));
      if (!deposit) {
        return res.status(404).json({ message: 'Direct deposit not found' });
      }
      res.status(200).json(deposit);
    } catch (error) {
      next(error);
    }
  }

  async updateDirectDeposit(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedDeposit = await DirectDepositService.updateDirectDeposit(new Types.ObjectId(req.params.companyId), new Types.ObjectId(req.params.directDepositId), req.body);
      if (!updatedDeposit) {
        return res.status(404).json({ message: 'Direct deposit not found' });
      }
      res.status(200).json(updatedDeposit);
    } catch (error) {
      next(error);
    }
  }

  async deleteDirectDeposit(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedDeposit = await DirectDepositService.deleteDirectDeposit(new Types.ObjectId(req.params.companyId), new Types.ObjectId(req.params.directDepositId));
      if (!deletedDeposit) {
        return res.status(404).json({ message: 'Direct deposit not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new DirectDepositController();
