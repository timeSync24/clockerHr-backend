// src/services/DemographicsService.ts
import { Types } from 'mongoose';
import Demographics, { IDemographics } from '../models/DemographicsModel';

class DemographicsService {
  // Create a new demographics record
  async createDemographics(data: Partial<IDemographics>): Promise<IDemographics> {
    const demographics = new Demographics(data);
    return demographics.save();
  }

  // Get all demographics records for a specific company
  async getDemographicsByCompany(companyId: Types.ObjectId): Promise<IDemographics[]> {
    return Demographics.find({ companyId }).exec();
  }

  // Get a specific demographics record by ID and company ID
  async getDemographicsById(companyId: Types.ObjectId, demographicsId: Types.ObjectId): Promise<IDemographics | null> {
    return Demographics.findOne({ _id: demographicsId, companyId }).exec();
  }

  // Update a specific demographics record
  async updateDemographics(companyId: Types.ObjectId, demographicsId: Types.ObjectId, data: Partial<IDemographics>): Promise<IDemographics | null> {
    return Demographics.findOneAndUpdate({ _id: demographicsId, companyId }, data, { new: true }).exec();
  }

  // Delete a specific demographics record
  async deleteDemographics(companyId: Types.ObjectId, demographicsId: Types.ObjectId): Promise<IDemographics | null> {
    return Demographics.findOneAndDelete({ _id: demographicsId, companyId }).exec();
  }
}

export default new DemographicsService();
