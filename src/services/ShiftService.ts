// src/services/ShiftService.ts
import Shift, { IShift } from '../models/ShiftModel';
import { Types } from 'mongoose';

class ShiftService {

  // Create a new shift
  async createShift(shiftData: Partial<IShift>): Promise<IShift> {
    const shift = new Shift(shiftData);
    return shift.save();
  }

  // Get all shifts for a specific company
  async getShiftsByCompany(companyId: Types.ObjectId): Promise<IShift[]> {
    return Shift.find({ companyId }).sort({ startTime: 1 });
  }

  // Get shifts for a specific employee in a company
  async getShiftsByEmployee(companyId: Types.ObjectId, employeeId: Types.ObjectId): Promise<IShift[]> {
    return Shift.find({ companyId, employeeId }).sort({ startTime: 1 });
  }

  // Get a single shift by ID
  async getShiftById(companyId: Types.ObjectId, shiftId: Types.ObjectId): Promise<IShift | null> {
    return Shift.findOne({ companyId, _id: shiftId });
  }

  // Update a shift by ID
  async updateShift(companyId: Types.ObjectId, shiftId: Types.ObjectId, updateData: Partial<IShift>): Promise<IShift | null> {
    return Shift.findOneAndUpdate({ companyId, _id: shiftId }, updateData, { new: true });
  }

  // Delete a shift by ID
  async deleteShift(companyId: Types.ObjectId, shiftId: Types.ObjectId): Promise<IShift | null> {
    return Shift.findOneAndDelete({ companyId, _id: shiftId });
  }
}

export default new ShiftService();
