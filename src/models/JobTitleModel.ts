import mongoose, { Schema, Document } from 'mongoose';

export interface IJobTitle extends Document {
  companyId: mongoose.Types.ObjectId; // Reference to the Company
  title: string;
  description?: string;
}

const jobTitleSchema = new Schema<IJobTitle>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const JobTitle = mongoose.model<IJobTitle>('JobTitle', jobTitleSchema);
export default JobTitle;
