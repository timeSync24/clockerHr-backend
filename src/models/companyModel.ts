import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  companyName: string;
  domain: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  admin: mongoose.Types.ObjectId;
  employees: mongoose.Types.ObjectId[]; // Added employees field
}

const companySchema = new Schema<ICompany>({
  companyName: { type: String, required: true },
  domain: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ensures admin is always set
  employees: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Added employees field
}, {
  timestamps: true 
});

// Pre-save middleware to capitalize the company name
companySchema.pre<ICompany>('save', function (next) {
  if (this.companyName) {
    this.companyName = this.companyName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  next();
});

const Company = mongoose.model<ICompany>('Company', companySchema);

export default Company;
