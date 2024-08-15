// models/NewsletterModel.ts
import { Schema, model, Document } from 'mongoose';

export interface INewsletter extends Document {
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['draft', 'sent', 'scheduled'], default: 'draft' },
    scheduledAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Newsletter = model<INewsletter>('Newsletter', NewsletterSchema);
