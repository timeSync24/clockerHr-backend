import { Request, Response, NextFunction } from 'express';
import BranchService from '../services/BranchService';
import { Types } from 'mongoose';

class BranchController {
  async createBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      console.log('Request body:', req.body); // Log the request body

      const branch = await BranchService.createBranch({ ...req.body, companyId });
      console.log('Branch created:', branch); // Log the created branch

      res.status(201).json(branch);
    } catch (error) {
      next(error);
    }
  }

  // Get all branches for the user's company
  async getBranchesByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const branches = await BranchService.getBranchesByCompany(companyId);
      res.json(branches);
    } catch (error) {
      next(error);
    }
  }

  // Get a single branch by ID
  async getBranchById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      const { branchId } = req.params;
      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const branch = await BranchService.getBranchById(companyId, new Types.ObjectId(branchId));
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.json(branch);
    } catch (error) {
      next(error);
    }
  }

  // Update a branch by ID
  async updateBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      const { branchId } = req.params;
      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const updatedBranch = await BranchService.updateBranch(companyId, new Types.ObjectId(branchId), req.body);
      if (!updatedBranch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.json(updatedBranch);
    } catch (error) {
      next(error);
    }
  }

  // Delete a branch by ID
  async deleteBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      const { branchId } = req.params;
      if (!companyId) {
        return res.status(400).json({ message: 'No company ID associated with the user.' });
      }

      const deletedBranch = await BranchService.deleteBranch(companyId, new Types.ObjectId(branchId));
      if (!deletedBranch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new BranchController();
