

import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  departmentName: string;
  description?: string;
  headOfDepartment: mongoose.Types.ObjectId; // Reference to User/Employee
  employeesCount: number; // To track the number of employees in the department
}

const departmentSchema = new Schema<IDepartment>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  departmentName: { type: String, required: true },
  description: { type: String },
  headOfDepartment: { type: Schema.Types.ObjectId, ref: 'User' },
  employeesCount: { type: Number, default: 0 }, // Add this field
}, { timestamps: true });

const Department = mongoose.model<IDepartment>('Department', departmentSchema);
export default Department;

