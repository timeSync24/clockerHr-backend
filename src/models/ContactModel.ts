import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  companyEmail: string;
  expertise: string;
  message: string;
  resolved: boolean; // Add this field
  resolvedBy?: mongoose.Types.ObjectId; // Add this field, optional reference to User
}

const ContactSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  companyEmail: { type: String, required: true },
  expertise: { type: String, required: true },
  message: { type: String, required: true },
  resolved: { type: Boolean, default: false }, // Initialize with default value
  resolvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // Reference to User
}, {
  timestamps: true,
});

const Contact = mongoose.model<IContact>('Contact', ContactSchema);
export default Contact;
