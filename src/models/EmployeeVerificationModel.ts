import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeVerification extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  employeeId: mongoose.Types.ObjectId; // Reference to the Employee
  identityVerified: boolean;
  workEligibilityVerified: boolean;
  backgroundCheckCompleted: boolean;
  verificationDate: Date;
  notes?: string;
}

const employeeVerificationSchema = new Schema<IEmployeeVerification>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  identityVerified: { type: Boolean, default: false },
  workEligibilityVerified: { type: Boolean, default: false },
  backgroundCheckCompleted: { type: Boolean, default: false },
  verificationDate: { type: Date, required: true },
  notes: { type: String },
}, { timestamps: true });

const EmployeeVerification = mongoose.model<IEmployeeVerification>('EmployeeVerification', employeeVerificationSchema);
export default EmployeeVerification;
