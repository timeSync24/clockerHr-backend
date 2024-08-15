// src/controllers/emailController.ts
import { Request, Response, NextFunction } from 'express';
import * as emailService from '../services/emailService';
import CustomError from '../utils/CustomError';
import errors from '../utils/errors';

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    if (!token) {
      throw new CustomError(errors.INVALID_TOKEN);
    }

    const user = await emailService.verifyEmail(token as string);

    res.json({ message: 'Email verified successfully', user });
  } catch (error) {
    next(error);
  }
};
