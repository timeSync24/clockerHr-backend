import mongoose, { Document, Schema } from 'mongoose';

export interface IDemographics extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  employeeId: mongoose.Types.ObjectId; // Reference to the Employee
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dateOfBirth: Date;
  ethnicity: string;
  nationality: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
  numberOfDependents: number;
  disabilityStatus?: boolean;
  veteranStatus?: boolean;
  languagesSpoken?: string[];
  religion?: string;
  height: number; // Added height field
  eyeColor: string; // Added eyeColor field
}

const demographicsSchema = new Schema<IDemographics>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], required: true },
  dateOfBirth: { type: Date, required: true },
  ethnicity: { type: String, required: true },
  nationality: { type: String, required: true },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'], required: true },
  numberOfDependents: { type: Number, required: true },
  disabilityStatus: { type: Boolean },
  veteranStatus: { type: Boolean },
  languagesSpoken: { type: [String] },
  religion: { type: String },
  height: { type: Number }, 
  eyeColor: { type: String },  
}, { timestamps: true });

const Demographics = mongoose.model<IDemographics>('Demographics', demographicsSchema);
export default Demographics;
