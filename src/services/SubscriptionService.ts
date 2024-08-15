import { Subscription, ISubscription } from '../models/SubscriptionModel';

export const createSubscription = async (subscriptionData: ISubscription): Promise<ISubscription> => {
  const subscription = new Subscription(subscriptionData);
  return await subscription.save();
};

export const getSubscriptions = async (): Promise<ISubscription[]> => {
  return await Subscription.find();
};

export const getSubscriptionById = async (id: string): Promise<ISubscription | null> => {
  return await Subscription.findById(id);
};

export const updateSubscription = async (subscriptionData: ISubscription): Promise<ISubscription | null> => {
  const { _id, ...updateData } = subscriptionData;
  return await Subscription.findByIdAndUpdate(_id, updateData, { new: true });
};

export const deleteSubscription = async (id: string): Promise<ISubscription | null> => {
  return await Subscription.findByIdAndDelete(id);
};

export const unsubscribe = async (email: string, newsletterId: string): Promise<ISubscription | null> => {
  return await Subscription.findOneAndUpdate(
    { email, newsletterId },
    { unsubscribedAt: new Date() },
    { new: true }
  );
};
