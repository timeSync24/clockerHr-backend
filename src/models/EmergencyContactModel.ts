import mongoose, { Document, Schema } from 'mongoose';

export interface IEmergencyContact extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  employeeId: mongoose.Types.ObjectId; // Reference to the Employee
  name: string;
  relationship: string;
  phoneNumbers: {
    type: 'Home' | 'Work' | 'Mobile';
    number: string;
  }[];
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const emergencyContactSchema = new Schema<IEmergencyContact>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phoneNumbers: [{
    type: { type: String, enum: ['Home', 'Work', 'Mobile'], required: true },
    number: { type: String, required: true },
  }],
  email: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  }
}, { timestamps: true });

const EmergencyContact = mongoose.model<IEmergencyContact>('EmergencyContact', emergencyContactSchema);
export default EmergencyContact;
