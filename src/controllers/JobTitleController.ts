import { Request, Response, NextFunction } from 'express';
import JobTitleService from '../services/JobTitleService';
import { Types } from 'mongoose';

class JobTitleController {
  // Create a new job title
  async createJobTitle(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const companyId = req.user?.companyIds[0];  // Assuming companyIds is an array and you need the first company ID

      const jobTitle = await JobTitleService.createJobTitle({
        companyId: new Types.ObjectId(companyId),
        title,
        description,
      });

      res.status(201).json(jobTitle);
    } catch (error) {
      next(error);
    }
  }

  // Get all job titles for a specific company
  async getJobTitles(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyIds[0];
      const jobTitles = await JobTitleService.getJobTitlesByCompany(new Types.ObjectId(companyId));
      res.json(jobTitles);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific job title by ID
  async getJobTitleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobTitleId } = req.params;
      const companyId = req.user?.companyIds[0];

      const jobTitle = await JobTitleService.getJobTitleById(new Types.ObjectId(companyId), new Types.ObjectId(jobTitleId));

      if (!jobTitle) {
        return res.status(404).json({ message: 'Job title not found' });
      }

      res.json(jobTitle);
    } catch (error) {
      next(error);
    }
  }

  // Update an existing job title
  async updateJobTitle(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobTitleId } = req.params;
      const companyId = req.user?.companyIds[0];
      const { title, description } = req.body;

      const updatedJobTitle = await JobTitleService.updateJobTitle(
        new Types.ObjectId(companyId),
        new Types.ObjectId(jobTitleId),
        { title, description }
      );

      if (!updatedJobTitle) {
        return res.status(404).json({ message: 'Job title not found' });
      }

      res.json(updatedJobTitle);
    } catch (error) {
      next(error);
    }
  }

  // Delete a job title
  async deleteJobTitle(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobTitleId } = req.params;
      const companyId = req.user?.companyIds[0];

      const deletedJobTitle = await JobTitleService.deleteJobTitle(
        new Types.ObjectId(companyId),
        new Types.ObjectId(jobTitleId)
      );

      if (!deletedJobTitle) {
        return res.status(404).json({ message: 'Job title not found' });
      }

      res.json({ message: 'Job title deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default new JobTitleController();
