// src/services/AttendanceService.ts
import Attendance, { IAttendance } from '../models/AttendanceModel';
import { Types } from 'mongoose';

class AttendanceService {
  // Create a new attendance record
  async createAttendance(data: Partial<IAttendance>): Promise<IAttendance> {
    const attendance = new Attendance(data);
    return attendance.save();
  }

  // Get all attendance records for a specific company
  async getAttendanceByCompany(companyId: Types.ObjectId): Promise<IAttendance[]> {
    return Attendance.find({ companyId }).sort({ date: -1 });
  }

  // Get a specific attendance record by ID
  async getAttendanceById(companyId: Types.ObjectId, attendanceId: Types.ObjectId): Promise<IAttendance | null> {
    return Attendance.findOne({ companyId, _id: attendanceId });
  }

  // Update an attendance record by ID
  async updateAttendance(companyId: Types.ObjectId, attendanceId: Types.ObjectId, updateData: Partial<IAttendance>): Promise<IAttendance | null> {
    return Attendance.findOneAndUpdate({ companyId, _id: attendanceId }, updateData, { new: true });
  }

  // Delete an attendance record by ID
  async deleteAttendance(companyId: Types.ObjectId, attendanceId: Types.ObjectId): Promise<IAttendance | null> {
    return Attendance.findOneAndDelete({ companyId, _id: attendanceId });
  }
}

export default new AttendanceService();
