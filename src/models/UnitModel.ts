import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUnit extends Document {
  companyId: Types.ObjectId; // Reference to the Company
  departmentId: Types.ObjectId; // Reference to the Department
  unitName: string;
  description?: string;
  headOfUnit: Types.ObjectId; // Reference to User/Employee
  employeeCount: number; // Number of employees in the unit
}

const unitSchema = new Schema<IUnit>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  unitName: { type: String, required: true },
  description: { type: String },
  headOfUnit: { type: Schema.Types.ObjectId, ref: 'User' }, 
  employeeCount: { type: Number, default: 0 }, 
}, { timestamps: true });

// Adding indexes for multi-tenancy and performance
unitSchema.index({ companyId: 1, departmentId: 1, unitName: 1 }, { unique: true });
unitSchema.index({ companyId: 1 });
unitSchema.index({ departmentId: 1 });

const Unit = mongoose.model<IUnit>('Unit', unitSchema);
export default Unit;
