// src/controllers/EmergencyContactController.ts
import { Request, Response, NextFunction } from 'express';
import EmergencyContactService from '../services/EmergencyContactService';
import { Types } from 'mongoose';

class EmergencyContactController {
    async createEmergencyContact(req: Request, res: Response, next: NextFunction) {
      try {
        // Check if req.user is defined
        if (!req.user) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Convert req.user._id from string to ObjectId
        const userId = new Types.ObjectId(req.user._id);
        
        const contact = await EmergencyContactService.createEmergencyContact(req.body, userId);
        res.status(201).json(contact);
      } catch (error) {
        next(error);
      }
    }

  async getEmergencyContactsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const contacts = await EmergencyContactService.getEmergencyContactsByCompany(new Types.ObjectId(req.params.companyId));
      res.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getEmergencyContactById(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await EmergencyContactService.getEmergencyContactById(new Types.ObjectId(req.params.companyId), new Types.ObjectId(req.params.emergencyContactId));
      if (!contact) {
        return res.status(404).json({ message: 'Emergency contact not found' });
      }
      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  }

  async updateEmergencyContact(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedContact = await EmergencyContactService.updateEmergencyContact(new Types.ObjectId(req.params.companyId), new Types.ObjectId(req.params.emergencyContactId), req.body);
      if (!updatedContact) {
        return res.status(404).json({ message: 'Emergency contact not found' });
      }
      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  }

  async deleteEmergencyContact(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedContact = await EmergencyContactService.deleteEmergencyContact(new Types.ObjectId(req.params.companyId), new Types.ObjectId(req.params.emergencyContactId));
      if (!deletedContact) {
        return res.status(404).json({ message: 'Emergency contact not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new EmergencyContactController();
