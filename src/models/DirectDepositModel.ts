import mongoose, { Document, Schema } from 'mongoose';

export interface IDirectDeposit extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  employeeId: mongoose.Types.ObjectId; // Reference to the Employee
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'Checking' | 'Savings';
  primaryAccount: boolean;
  amount: number | null; // Amount to deposit into this account (if split between multiple accounts)
}

const directDepositSchema = new Schema<IDirectDeposit>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  routingNumber: { type: String, required: true },
  accountType: { type: String, enum: ['Checking', 'Savings'], required: true },
  primaryAccount: { type: Boolean, required: true, default: false },
  amount: { type: Number, default: null }, // Null if the full deposit goes to this account
}, { timestamps: true });

const DirectDeposit = mongoose.model<IDirectDeposit>('DirectDeposit', directDepositSchema);
export default DirectDeposit;
