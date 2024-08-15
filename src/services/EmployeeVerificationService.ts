// src/services/EmployeeVerificationService.ts
import EmployeeVerification, { IEmployeeVerification } from '../models/EmployeeVerificationModel';
import { Types } from 'mongoose';

class EmployeeVerificationService {
  // Create a new employee verification record
  async createEmployeeVerification(data: Partial<IEmployeeVerification>): Promise<IEmployeeVerification> {
    const employeeVerification = new EmployeeVerification(data);
    return employeeVerification.save();
  }

  // Get all employee verification records for a specific company
  async getEmployeeVerificationsByCompany(companyId: Types.ObjectId): Promise<IEmployeeVerification[]> {
    return EmployeeVerification.find({ companyId }).sort({ verificationDate: -1 });
  }

  // Get a single employee verification record by ID
  async getEmployeeVerificationById(companyId: Types.ObjectId, verificationId: Types.ObjectId): Promise<IEmployeeVerification | null> {
    return EmployeeVerification.findOne({ companyId, _id: verificationId });
  }

  // Update an employee verification record by ID
  async updateEmployeeVerification(companyId: Types.ObjectId, verificationId: Types.ObjectId, updateData: Partial<IEmployeeVerification>): Promise<IEmployeeVerification | null> {
    return EmployeeVerification.findOneAndUpdate({ companyId, _id: verificationId }, updateData, { new: true });
  }

  // Delete an employee verification record by ID
  async deleteEmployeeVerification(companyId: Types.ObjectId, verificationId: Types.ObjectId): Promise<IEmployeeVerification | null> {
    return EmployeeVerification.findOneAndDelete({ companyId, _id: verificationId });
  }
}

export default new EmployeeVerificationService();
