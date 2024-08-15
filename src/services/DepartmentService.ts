// src/services/DepartmentService.ts
import Department, { IDepartment } from '../models/DepartmentModel';
import { Types } from 'mongoose';

class DepartmentService {
  // Create a new department
  async createDepartment(data: Partial<IDepartment>): Promise<IDepartment> {
    const department = new Department(data);
    return department.save();
  }

  async getDepartmentsByCompany(companyIds: Types.ObjectId | Types.ObjectId[]): Promise<IDepartment[]> {
    // Handle both single and multiple company IDs
    return Department.find({ companyId: { $in: Array.isArray(companyIds) ? companyIds : [companyIds] } })
      .populate('headOfDepartment', 'firstName lastName'); // Populate department head details
  }

  // Get a single department by ID and company ID (multi-tenancy)
  async getDepartmentById(companyId: Types.ObjectId, departmentId: Types.ObjectId): Promise<IDepartment | null> {
    return Department.findOne({ _id: departmentId, companyId });
  }

  // Update an existing department by ID and company ID (multi-tenancy)
  async updateDepartment(companyIds: Types.ObjectId | Types.ObjectId[], departmentId: Types.ObjectId, data: Partial<IDepartment>): Promise<IDepartment | null> {
    return Department.findOneAndUpdate(
      { _id: departmentId, companyId: { $in: Array.isArray(companyIds) ? companyIds : [companyIds] } },
      data,
      { new: true }
    );
  }


  // Delete a department by ID and company ID (multi-tenancy)
  async deleteDepartment(companyIds: Types.ObjectId | Types.ObjectId[], departmentId: Types.ObjectId): Promise<IDepartment | null> {
    return Department.findOneAndDelete(
      { _id: departmentId, companyId: { $in: Array.isArray(companyIds) ? companyIds : [companyIds] } }
    );
  }
}
  

export default new DepartmentService();
