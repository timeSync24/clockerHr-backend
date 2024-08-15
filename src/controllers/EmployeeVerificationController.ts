// src/controllers/EmployeeVerificationController.ts
import { Request, Response, NextFunction } from 'express';
import EmployeeVerificationService from '../services/EmployeeVerificationService';
import { Types } from 'mongoose';

class EmployeeVerificationController {

  // Create a new employee verification record
  async createEmployeeVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const employeeVerification = await EmployeeVerificationService.createEmployeeVerification(req.body);
      res.status(201).json(employeeVerification);
    } catch (error) {
      next(error);
    }
  }

  // Get all employee verification records for a specific company
  async getEmployeeVerificationsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const employeeVerifications = await EmployeeVerificationService.getEmployeeVerificationsByCompany(new Types.ObjectId(companyId));
      res.json(employeeVerifications);
    } catch (error) {
      next(error);
    }
  }

  // Get a single employee verification record by ID
  async getEmployeeVerificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, verificationId } = req.params;
      const employeeVerification = await EmployeeVerificationService.getEmployeeVerificationById(new Types.ObjectId(companyId), new Types.ObjectId(verificationId));
      if (!employeeVerification) {
        return res.status(404).json({ message: 'Employee verification not found' });
      }
      res.json(employeeVerification);
    } catch (error) {
      next(error);
    }
  }

  // Update an employee verification record by ID
  async updateEmployeeVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, verificationId } = req.params;
      const updatedEmployeeVerification = await EmployeeVerificationService.updateEmployeeVerification(new Types.ObjectId(companyId), new Types.ObjectId(verificationId), req.body);
      if (!updatedEmployeeVerification) {
        return res.status(404).json({ message: 'Employee verification not found' });
      }
      res.json(updatedEmployeeVerification);
    } catch (error) {
      next(error);
    }
  }

  // Delete an employee verification record by ID
  async deleteEmployeeVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, verificationId } = req.params;
      const deletedEmployeeVerification = await EmployeeVerificationService.deleteEmployeeVerification(new Types.ObjectId(companyId), new Types.ObjectId(verificationId));
      if (!deletedEmployeeVerification) {
        return res.status(404).json({ message: 'Employee verification not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeVerificationController();
