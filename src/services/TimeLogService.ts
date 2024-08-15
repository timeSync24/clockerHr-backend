// src/services/TimeLogService.ts
import TimeLog, { ITimeLog } from '../models/TimeLogModel';
import { Types } from 'mongoose';

class TimeLogService {
  // Create a new time log
  async createTimeLog(timeLogData: Partial<ITimeLog>): Promise<ITimeLog> {
    const timeLog = new TimeLog(timeLogData);
    return timeLog.save();
  }

  // Get all time logs for a specific company
  async getTimeLogsByCompany(companyId: Types.ObjectId): Promise<ITimeLog[]> {
    return TimeLog.find({ companyId }).sort({ clockInTime: -1 });
  }

  // Get time logs for a specific employee
  async getTimeLogsByEmployee(companyId: Types.ObjectId, employeeId: Types.ObjectId): Promise<ITimeLog[]> {
    return TimeLog.find({ companyId, employeeId }).sort({ clockInTime: -1 });
  }

  // Get a single time log by ID
  async getTimeLogById(companyId: Types.ObjectId, timeLogId: Types.ObjectId): Promise<ITimeLog | null> {
    return TimeLog.findOne({ companyId, _id: timeLogId });
  }

  // Update a time log by ID
  async updateTimeLog(companyId: Types.ObjectId, timeLogId: Types.ObjectId, updateData: Partial<ITimeLog>): Promise<ITimeLog | null> {
    return TimeLog.findOneAndUpdate({ companyId, _id: timeLogId }, updateData, { new: true });
  }

  // Delete a time log by ID
  async deleteTimeLog(companyId: Types.ObjectId, timeLogId: Types.ObjectId): Promise<ITimeLog | null> {
    return TimeLog.findOneAndDelete({ companyId, _id: timeLogId });
  }
}

export default new TimeLogService();
