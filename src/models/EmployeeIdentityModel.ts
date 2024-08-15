import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeIdentity extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  employeeId: mongoose.Types.ObjectId; // Reference to the Employee
  documentType: 'Passport' | 'National ID' | 'Driver’s License' | 'Work Permit';
  documentNumber: string;
  issuedDate: Date;
  expiryDate: Date;
  countryOfIssue: string;
  documentFileUrl?: string; // URL to the document file
}

const employeeIdentitySchema = new Schema<IEmployeeIdentity>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  documentType: { type: String, enum: ['Passport', 'National ID', 'Driver’s License', 'Work Permit'], required: true },
  documentNumber: { type: String, required: true },
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  countryOfIssue: { type: String, required: true },
  documentFileUrl: { type: String },
}, { timestamps: true });

const EmployeeIdentity = mongoose.model<IEmployeeIdentity>('EmployeeIdentity', employeeIdentitySchema);
export default EmployeeIdentity;
