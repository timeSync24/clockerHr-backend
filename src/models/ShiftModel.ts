import mongoose, { Document, Schema } from 'mongoose';

export interface IShift extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  employeeId: mongoose.Types.ObjectId; // Reference to the Employee
  shiftName: string;
  startTime: Date;
  endTime: Date;
  breakDuration: number; // Duration of breaks in minutes
  departmentId?: mongoose.Types.ObjectId; // Reference to Department, if needed
  unitId?: mongoose.Types.ObjectId; // Reference to Unit, if needed
  branchId?: mongoose.Types.ObjectId; // Reference to Branch, if needed
}

const shiftSchema = new Schema<IShift>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  shiftName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  breakDuration: { type: Number, required: true }, // In minutes
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
  unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
}, { timestamps: true });

// indexing 
  shiftSchema.index({ companyId: 1, employeeId: 1, startTime: 1 }, { unique: true });
  shiftSchema.index({ startTime: 1, endTime: 1 });
  shiftSchema.index({ departmentId: 1, unitId: 1, branchId: 1 });
  
// Export the Shift model

const Shift = mongoose.model<IShift>('Shift', shiftSchema);
export default Shift;
