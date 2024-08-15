// services/NewsletterService.ts
import { Newsletter, INewsletter } from '../models/NewsletterModel';

export const createNewsletter = async (newsletterData: INewsletter): Promise<INewsletter> => {
  const newsletter = new Newsletter(newsletterData);
  return await newsletter.save();
};

export const getNewsletters = async (): Promise<INewsletter[]> => {
  return await Newsletter.find();
};

export const getNewsletterById = async (id: string): Promise<INewsletter | null> => {
  return await Newsletter.findById(id);
};

export const updateNewsletter = async (newsletterData: INewsletter): Promise<INewsletter | null> => {
  const { _id, ...updateData } = newsletterData;
  return await Newsletter.findByIdAndUpdate(_id, updateData, { new: true });
};

export const deleteNewsletter = async (id: string): Promise<INewsletter | null> => {
  return await Newsletter.findByIdAndDelete(id);
};
