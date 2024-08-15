// src/controllers/companyController.ts
import { Request, Response, NextFunction } from 'express';
import * as companyService from '../services/companyService';
import CustomError from '../utils/CustomError';
import errors from '../utils/errors';
import { verifyToken } from '../utils/token';
import User from '../models/userModel';

export const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await companyService.getCompanies();
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    if (!company) {
      throw new CustomError(errors.COMPANY_NOT_FOUND);
    }
    res.json(company);
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await companyService.createCompany(req.body);
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    if (!company) {
      throw new CustomError(errors.COMPANY_NOT_FOUND);
    }
    res.json(company);
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await companyService.deleteCompany(req.params.id);
    if (!company) {
      throw new CustomError(errors.COMPANY_NOT_FOUND);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    if (!token) {
      throw new CustomError(errors.INVALID_TOKEN);
    }

    const decoded = verifyToken(token as string);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};
