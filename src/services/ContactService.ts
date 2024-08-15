import Contact, { IContact } from '../models/ContactModel';

export const createContact = async (contactData: IContact): Promise<IContact> => {
  const contact = new Contact(contactData);
  return await contact.save();
};

export const getContacts = async (): Promise<IContact[]> => {
  return await Contact.find();
};

export const getContactById = async (id: string): Promise<IContact | null> => {
  return await Contact.findById(id);
};

export const updateContact = async (contactData: IContact): Promise<IContact | null> => {
  const { _id, ...updateData } = contactData;
  return await Contact.findByIdAndUpdate(_id, updateData, { new: true });
};

export const resolveContact = async (id: string, resolved: boolean, resolvedBy?: string): Promise<IContact | null> => {
  return await Contact.findByIdAndUpdate(id, { resolved, resolvedBy }, { new: true });
};

export const deleteContact = async (id: string): Promise<IContact | null> => {
  return await Contact.findByIdAndDelete(id);
};
