// src\middlewares\authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/CustomError';
import errors from '../utils/errors';
import { TokenPayload } from '../types/token';
import User from '../models/userModel';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    console.log('Token from cookies:', token);

    if (!token) {
      throw new CustomError(errors.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId).exec();
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }

    req.user = { ...decoded, _id: user._id.toString() } as TokenPayload & { _id: string };
    console.log('User added to req:', req.user);

    next();
  } catch (error) {
    console.error('Error in verifyToken:', error);
    next(new CustomError(errors.UNAUTHORIZED));
  }
};
