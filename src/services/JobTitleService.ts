import JobTitle, { IJobTitle } from '../models/JobTitleModel';
import { Types } from 'mongoose';

class JobTitleService {
  // Create a new job title
  async createJobTitle(data: Partial<IJobTitle>): Promise<IJobTitle> {
    const jobTitle = new JobTitle(data);
    return jobTitle.save();
  }

  // Get all job titles for a specific company
  async getJobTitlesByCompany(companyId: Types.ObjectId): Promise<IJobTitle[]> {
    return JobTitle.find({ companyId });
  }

  // Get a single job title by ID and company ID (multi-tenancy)
  async getJobTitleById(companyId: Types.ObjectId, jobTitleId: Types.ObjectId): Promise<IJobTitle | null> {
    return JobTitle.findOne({ _id: jobTitleId, companyId });
  }

  // Update an existing job title by ID and company ID (multi-tenancy)
  async updateJobTitle(companyId: Types.ObjectId, jobTitleId: Types.ObjectId, data: Partial<IJobTitle>): Promise<IJobTitle | null> {
    return JobTitle.findOneAndUpdate({ _id: jobTitleId, companyId }, data, { new: true });
  }

  // Delete a job title by ID and company ID (multi-tenancy)
  async deleteJobTitle(companyId: Types.ObjectId, jobTitleId: Types.ObjectId): Promise<IJobTitle | null> {
    return JobTitle.findOneAndDelete({ _id: jobTitleId, companyId });
  }
}

export default new JobTitleService();
