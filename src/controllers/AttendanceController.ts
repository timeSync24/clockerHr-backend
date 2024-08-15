// src/controllers/AttendanceController.ts
import { Request, Response, NextFunction } from 'express';
import AttendanceService from '../services/AttendanceService';
import { Types } from 'mongoose';

class AttendanceController {
  // Create a new attendance record
  async createAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const attendance = await AttendanceService.createAttendance(req.body);
      res.status(201).json(attendance);
    } catch (error) {
      next(error);
    }
  }

  // Get all attendance records for a specific company
  async getAttendanceByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const attendanceRecords = await AttendanceService.getAttendanceByCompany(new Types.ObjectId(companyId));
      res.json(attendanceRecords);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific attendance record by ID
  async getAttendanceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, attendanceId } = req.params;
      const attendance = await AttendanceService.getAttendanceById(new Types.ObjectId(companyId), new Types.ObjectId(attendanceId));
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
      res.json(attendance);
    } catch (error) {
      next(error);
    }
  }

  // Update an attendance record by ID
  async updateAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, attendanceId } = req.params;
      const updatedAttendance = await AttendanceService.updateAttendance(new Types.ObjectId(companyId), new Types.ObjectId(attendanceId), req.body);
      if (!updatedAttendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
      res.json(updatedAttendance);
    } catch (error) {
      next(error);
    }
  }

  // Delete an attendance record by ID
  async deleteAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, attendanceId } = req.params;
      const deletedAttendance = await AttendanceService.deleteAttendance(new Types.ObjectId(companyId), new Types.ObjectId(attendanceId));
      if (!deletedAttendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new AttendanceController();
