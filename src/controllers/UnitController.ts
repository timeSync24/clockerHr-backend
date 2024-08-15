import { Request, Response, NextFunction } from 'express';
import UnitService from '../services/UnitService';
import { Types } from 'mongoose';

class UnitController {
  
  // Create a new unit
  async createUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      const unitData = { ...req.body, companyId };
      const unit = await UnitService.createUnit(unitData);
      res.status(201).json(unit);
    } catch (error) {
      next(error);
    }
  }

  // Get all units for a specific company
  async getUnitsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      const units = await UnitService.getUnitsByCompany(companyId);
      res.json(units);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific unit by ID
  async getUnitById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      const { unitId } = req.params;
      const unit = await UnitService.getUnitById(companyId, new Types.ObjectId(unitId));
      if (!unit) {
        return res.status(404).json({ message: 'Unit not found' });
      }
      res.json(unit);
    } catch (error) {
      next(error);
    }
  }

  // Update a specific unit by ID
  async updateUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      const { unitId } = req.params;
      const updatedUnit = await UnitService.updateUnit(companyId, new Types.ObjectId(unitId), req.body);
      if (!updatedUnit) {
        return res.status(404).json({ message: 'Unit not found' });
      }
      res.json(updatedUnit);
    } catch (error) {
      next(error);
    }
  }

  // Delete a specific unit by ID
  async deleteUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds ? new Types.ObjectId(req.user.companyIds[0]) : undefined;
      const { unitId } = req.params;
      const deletedUnit = await UnitService.deleteUnit(companyId, new Types.ObjectId(unitId));
      if (!deletedUnit) {
        return res.status(404).json({ message: 'Unit not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new UnitController();
