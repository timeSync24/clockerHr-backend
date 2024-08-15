import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';
import errors from '../utils/errors';

const verifyCompany = (req: Request, res: Response, next: NextFunction) => {
  const userCompanyIds = req.user?.companyIds || [];
  const paramCompanyId = req.params.companyId;

  // Log the user company IDs and the parameter company ID for debugging
  console.log('User company IDs:', userCompanyIds);
  console.log('Parameter company ID:', paramCompanyId);

  // Check if the user has the 'logaxpAdmin' role
  if (req.user?.role === 'logaxpAdmin') {
    return next(); // Allow access for 'logaxpAdmin' role
  }

  // Check if paramCompanyId exists and is part of the user's company IDs
  if (paramCompanyId && !userCompanyIds.includes(paramCompanyId)) {
    return next(new CustomError(errors.FORBIDDEN));
  }

  next(); // Allow access if the checks pass
};

export default verifyCompany;
