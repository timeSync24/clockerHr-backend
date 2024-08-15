import { Request, Response, NextFunction } from 'express';
import * as ContactService from '../services/ContactService';
import { IContact } from '../models/ContactModel';

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contactData: IContact = req.body;
    const newContact = await ContactService.createContact(contactData);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await ContactService.getContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await ContactService.getContactById(req.params.id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contactData: IContact = req.body;
    const updatedContact = await ContactService.updateContact(contactData);
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const resolveContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contactId = req.params.id;
    const { resolved, resolvedBy } = req.body; // Ensure resolved and resolvedBy are provided
    const updatedContact = await ContactService.resolveContact(contactId, resolved, resolvedBy);
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await ContactService.deleteContact(req.params.id);
    if (contact) {
      res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    next(error);
  }
};
