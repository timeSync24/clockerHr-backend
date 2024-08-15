// src/services/EmergencyContactService.ts
import { Types } from 'mongoose';
import EmergencyContact, { IEmergencyContact } from '../models/EmergencyContactModel';

class EmergencyContactService {
  async createEmergencyContact(contactData: Partial<IEmergencyContact>, userId: Types.ObjectId): Promise<IEmergencyContact> {
    const newContact = new EmergencyContact({ ...contactData, employeeId: userId });
    return newContact.save();
  }

  async getEmergencyContactsByCompany(companyId: Types.ObjectId): Promise<IEmergencyContact[]> {
    return EmergencyContact.find({ companyId }).exec();
  }

  async getEmergencyContactById(companyId: Types.ObjectId, contactId: Types.ObjectId): Promise<IEmergencyContact | null> {
    return EmergencyContact.findOne({ _id: contactId, companyId }).exec();
  }

  async updateEmergencyContact(companyId: Types.ObjectId, contactId: Types.ObjectId, updateData: Partial<IEmergencyContact>): Promise<IEmergencyContact | null> {
    return EmergencyContact.findOneAndUpdate({ _id: contactId, companyId }, updateData, { new: true }).exec();
  }

  async deleteEmergencyContact(companyId: Types.ObjectId, contactId: Types.ObjectId): Promise<IEmergencyContact | null> {
    return EmergencyContact.findOneAndDelete({ _id: contactId, companyId }).exec();
  }
}

export default new EmergencyContactService();
