// src/services/EmployeeIdentityService.ts
import EmployeeIdentity, { IEmployeeIdentity } from '../models/EmployeeIdentityModel';
import { Types } from 'mongoose';

class EmployeeIdentityService {
  // Create a new employee identity record
  async createEmployeeIdentity(data: Partial<IEmployeeIdentity>): Promise<IEmployeeIdentity> {
    const employeeIdentity = new EmployeeIdentity(data);
    return employeeIdentity.save();
  }

  // Get all employee identity records for a specific company
  async getEmployeeIdentitiesByCompany(companyId: Types.ObjectId): Promise<IEmployeeIdentity[]> {
    return EmployeeIdentity.find({ companyId }).sort({ issuedDate: -1 });
  }

  // Get a single employee identity record by ID
  async getEmployeeIdentityById(companyId: Types.ObjectId, identityId: Types.ObjectId): Promise<IEmployeeIdentity | null> {
    return EmployeeIdentity.findOne({ companyId, _id: identityId });
  }

  // Update an employee identity record by ID
  async updateEmployeeIdentity(companyId: Types.ObjectId, identityId: Types.ObjectId, updateData: Partial<IEmployeeIdentity>): Promise<IEmployeeIdentity | null> {
    return EmployeeIdentity.findOneAndUpdate({ companyId, _id: identityId }, updateData, { new: true });
  }

  // Delete an employee identity record by ID
  async deleteEmployeeIdentity(companyId: Types.ObjectId, identityId: Types.ObjectId): Promise<IEmployeeIdentity | null> {
    return EmployeeIdentity.findOneAndDelete({ companyId, _id: identityId });
  }
}

export default new EmployeeIdentityService();
