// src/middleware/verifyRole.ts
import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';
import errors from '../utils/errors';

const verifyRole = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    console.log('User role:', userRole);
    console.log('Required roles:', requiredRoles);

    if (!userRole || !requiredRoles.includes(userRole)) {
      console.error('User role not authorized');
      return next(new CustomError(errors.FORBIDDEN));
    }

    console.log('User role authorized');
    next();
  };
};

export default verifyRole;

