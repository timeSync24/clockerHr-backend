import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId?: string;
  email: string;
  newsletterId: string;
  subscribedAt?: Date;
  unsubscribedAt?: Date | null;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    newsletterId: {
      type: String,
      required: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
  }
);

export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);
