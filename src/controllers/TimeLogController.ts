// src/controllers/TimeLogController.ts
import { Request, Response, NextFunction } from 'express';
import TimeLogService from '../services/TimeLogService';
import { Types } from 'mongoose';

class TimeLogController {

  // Create a new time log
  async createTimeLog(req: Request, res: Response, next: NextFunction) {
    try {
      const timeLog = await TimeLogService.createTimeLog(req.body);
      res.status(201).json(timeLog);
    } catch (error) {
      next(error);
    }
  }

  // Get all time logs for a specific company
  async getTimeLogsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const timeLogs = await TimeLogService.getTimeLogsByCompany(new Types.ObjectId(companyId));
      res.json(timeLogs);
    } catch (error) {
      next(error);
    }
  }

  // Get time logs for a specific employee
  async getTimeLogsByEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, employeeId } = req.params;
      const timeLogs = await TimeLogService.getTimeLogsByEmployee(new Types.ObjectId(companyId), new Types.ObjectId(employeeId));
      res.json(timeLogs);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific time log by ID
  async getTimeLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, timeLogId } = req.params;
      const timeLog = await TimeLogService.getTimeLogById(new Types.ObjectId(companyId), new Types.ObjectId(timeLogId));
      if (!timeLog) {
        return res.status(404).json({ message: 'TimeLog not found' });
      }
      res.json(timeLog);
    } catch (error) {
      next(error);
    }
  }

  // Update a specific time log by ID
  async updateTimeLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, timeLogId } = req.params;
      const updatedTimeLog = await TimeLogService.updateTimeLog(new Types.ObjectId(companyId), new Types.ObjectId(timeLogId), req.body);
      if (!updatedTimeLog) {
        return res.status(404).json({ message: 'TimeLog not found' });
      }
      res.json(updatedTimeLog);
    } catch (error) {
      next(error);
    }
  }

  // Delete a specific time log by ID
  async deleteTimeLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, timeLogId } = req.params;
      const deletedTimeLog = await TimeLogService.deleteTimeLog(new Types.ObjectId(companyId), new Types.ObjectId(timeLogId));
      if (!deletedTimeLog) {
        return res.status(404).json({ message: 'TimeLog not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new TimeLogController();
