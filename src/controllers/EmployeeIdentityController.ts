// src/controllers/EmployeeIdentityController.ts
import { Request, Response, NextFunction } from 'express';
import EmployeeIdentityService from '../services/EmployeeIdentityService';
import { Types } from 'mongoose';

class EmployeeIdentityController {
  async createEmployeeIdentity(req: Request, res: Response, next: NextFunction) {
    try {
      const employeeIdentity = await EmployeeIdentityService.createEmployeeIdentity(req.body);
      res.status(201).json(employeeIdentity);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeIdentitiesByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const employeeIdentities = await EmployeeIdentityService.getEmployeeIdentitiesByCompany(new Types.ObjectId(companyId));
      res.json(employeeIdentities);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeIdentityById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, identityId } = req.params;
      const employeeIdentity = await EmployeeIdentityService.getEmployeeIdentityById(
        new Types.ObjectId(companyId),
        new Types.ObjectId(identityId)
      );
      if (!employeeIdentity) {
        return res.status(404).json({ message: 'Employee identity not found' });
      }
      res.json(employeeIdentity);
    } catch (error) {
      next(error);
    }
  }

  async updateEmployeeIdentity(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, identityId } = req.params;
      const updatedEmployeeIdentity = await EmployeeIdentityService.updateEmployeeIdentity(
        new Types.ObjectId(companyId),
        new Types.ObjectId(identityId),
        req.body
      );
      if (!updatedEmployeeIdentity) {
        return res.status(404).json({ message: 'Employee identity not found' });
      }
      res.json(updatedEmployeeIdentity);
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployeeIdentity(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, identityId } = req.params;
      const deletedEmployeeIdentity = await EmployeeIdentityService.deleteEmployeeIdentity(
        new Types.ObjectId(companyId),
        new Types.ObjectId(identityId)
      );
      if (!deletedEmployeeIdentity) {
        return res.status(404).json({ message: 'Employee identity not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeIdentityController();
