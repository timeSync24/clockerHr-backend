// src/controllers/ShiftController.ts
import { Request, Response, NextFunction } from 'express';
import ShiftService from '../services/ShiftService';
import { Types } from 'mongoose';

class ShiftController {

  // Create a new shift
  async createShift(req: Request, res: Response, next: NextFunction) {
    try {
      const shift = await ShiftService.createShift(req.body);
      res.status(201).json(shift);
    } catch (error) {
      next(error);
    }
  }

  // Get all shifts for a specific company
  async getShiftsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const shifts = await ShiftService.getShiftsByCompany(new Types.ObjectId(companyId));
      res.json(shifts);
    } catch (error) {
      next(error);
    }
  }

  // Get shifts for a specific employee in a company
  async getShiftsByEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, employeeId } = req.params;
      const shifts = await ShiftService.getShiftsByEmployee(new Types.ObjectId(companyId), new Types.ObjectId(employeeId));
      res.json(shifts);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific shift by ID
  async getShiftById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, shiftId } = req.params;
      const shift = await ShiftService.getShiftById(new Types.ObjectId(companyId), new Types.ObjectId(shiftId));
      if (!shift) {
        return res.status(404).json({ message: 'Shift not found' });
      }
      res.json(shift);
    } catch (error) {
      next(error);
    }
  }

  // Update a specific shift by ID
  async updateShift(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, shiftId } = req.params;
      const updatedShift = await ShiftService.updateShift(new Types.ObjectId(companyId), new Types.ObjectId(shiftId), req.body);
      if (!updatedShift) {
        return res.status(404).json({ message: 'Shift not found' });
      }
      res.json(updatedShift);
    } catch (error) {
      next(error);
    }
  }

  // Delete a specific shift by ID
  async deleteShift(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, shiftId } = req.params;
      const deletedShift = await ShiftService.deleteShift(new Types.ObjectId(companyId), new Types.ObjectId(shiftId));
      if (!deletedShift) {
        return res.status(404).json({ message: 'Shift not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ShiftController();
