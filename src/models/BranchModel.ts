import mongoose, { Schema, Document } from 'mongoose';

export interface IBranch extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  branchName: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    employeeCount: number; // Number of employees in the branch
  };
  phone: string;
  branchManager: mongoose.Types.ObjectId; // Reference to User/Employee
}

const branchSchema = new Schema<IBranch>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  branchName: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    employeeCount: { type: Number, default: 0 }, 
  },
  phone: { type: String, required: true },
  branchManager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });


branchSchema.index({ companyId: 1, branchName: 1 }, { unique: true });


const Branch = mongoose.model<IBranch>('Branch', branchSchema);
export default Branch;
