// src/controllers/DemographicsController.ts
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import DemographicsService from '../services/DemographicsService';

class DemographicsController {
  // Create a new demographics record
  async createDemographics(req: Request, res: Response, next: NextFunction) {
    try {
      const demographics = await DemographicsService.createDemographics(req.body);
      res.status(201).json(demographics);
    } catch (error) {
      next(error);
    }
  }

  // Get all demographics records for a specific company
  async getDemographicsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const demographics = await DemographicsService.getDemographicsByCompany(new Types.ObjectId(companyId));
      res.status(200).json(demographics);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific demographics record by ID
  async getDemographicsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, demographicsId } = req.params;
      const demographics = await DemographicsService.getDemographicsById(new Types.ObjectId(companyId), new Types.ObjectId(demographicsId));
      if (!demographics) {
        return res.status(404).json({ message: 'Demographics record not found' });
      }
      res.status(200).json(demographics);
    } catch (error) {
      next(error);
    }
  }

  // Update a specific demographics record
  async updateDemographics(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, demographicsId } = req.params;
      const updatedDemographics = await DemographicsService.updateDemographics(new Types.ObjectId(companyId), new Types.ObjectId(demographicsId), req.body);
      if (!updatedDemographics) {
        return res.status(404).json({ message: 'Demographics record not found' });
      }
      res.status(200).json(updatedDemographics);
    } catch (error) {
      next(error);
    }
  }

  // Delete a specific demographics record
  async deleteDemographics(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, demographicsId } = req.params;
      const deletedDemographics = await DemographicsService.deleteDemographics(new Types.ObjectId(companyId), new Types.ObjectId(demographicsId));
      if (!deletedDemographics) {
        return res.status(404).json({ message: 'Demographics record not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new DemographicsController();
