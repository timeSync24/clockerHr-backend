import { Request, Response, NextFunction } from 'express';
import LogaxpAdminService from '../services/LogaxpAdminService';

export const getAllLogaxpAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logaxpAdmins = await LogaxpAdminService.getAllLogaxpAdmins();
    res.json(logaxpAdmins);
  } catch (error) {
    next(error);
  }
};

export const getActiveLogaxpAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeLogaxpAdmins = await LogaxpAdminService.getActiveLogaxpAdmins();
    res.json(activeLogaxpAdmins);
  } catch (error) {
    next(error);
  }
};

export const createLogaxpAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logaxpAdmin = await LogaxpAdminService.createLogaxpAdmin(req.body);
    res.status(201).json(logaxpAdmin);
  } catch (error) {
    next(error);
  }
};

export const updateLogaxpAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedAdmin = await LogaxpAdminService.updateLogaxpAdmin(req.params.id, req.body);
    res.json(updatedAdmin);
  } catch (error) {
    next(error);
  }
};

export const deleteLogaxpAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await LogaxpAdminService.deleteLogaxpAdmin(req.params.id);
    res.status(204).json({ message: 'LogaxpAdmin deleted' });
  } catch (error) {
    next(error);
  }
};

export const getLogaxpAdminById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logaxpAdmin = await LogaxpAdminService.getLogaxpAdminById(req.params.id);
    res.json(logaxpAdmin);
  } catch (error) {
    next(error);
  }
};

export const activateLogaxpAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activatedAdmin = await LogaxpAdminService.activateLogaxpAdmin(req.params.id);
    res.json(activatedAdmin);
  } catch (error) {
    next(error);
  }
};

export const deactivateLogaxpAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deactivatedAdmin = await LogaxpAdminService.deactivateLogaxpAdmin(req.params.id);
    res.json(deactivatedAdmin);
  } catch (error) {
    next(error);
  }
};


export const getTotalUsersPerCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalUsersPerCompany = await LogaxpAdminService.getTotalUsersPerCompany();
      res.json(totalUsersPerCompany);
    } catch (error) {
      next(error);
    }
  };