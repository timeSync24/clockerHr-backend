import mongoose, { Schema } from 'mongoose';
import User, { IUser } from './userModel';


export interface IEmployee extends IUser {
  employeeNumber: string;
  jobTitleId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId; 
  unitId?: mongoose.Types.ObjectId; 
  branchId?: mongoose.Types.ObjectId; 
  managerId?: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  dateOfHire: Date;
  salary?: number; 
  hourlyRate?: number; 
  payType: 'Salaried' | 'Hourly' | 'Commission' | 'Contract';
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract';
  probationEndDate?: Date; 
  terminationDate?: Date;
  terminationReason?: string; 
}
const employeeSchema = new Schema<IEmployee>({
  employeeNumber: { type: String, required: true, unique: true },
  jobTitleId: { type: Schema.Types.ObjectId, ref: 'JobTitle', required: true }, 
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
  managerId: { type: Schema.Types.ObjectId, ref: 'User' },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true }, // Ensure this is included if required
  dateOfHire: { type: Date, required: true },
  salary: { type: Number },
  hourlyRate: { type: Number }, 
  payType: { type: String, required: true, enum: ['Salaried', 'Hourly', 'Commission', 'Contract'] },
  employmentType: { type: String, required: true, enum: ['Full-Time', 'Part-Time', 'Contract'] },
  probationEndDate: { type: Date }, 
  terminationDate: { type: Date },
  terminationReason: { type: String }, 
}, { timestamps: true });

// Use discriminator to extend the User model
const Employee = User.discriminator<IEmployee>('Employee', employeeSchema);

export default Employee;
