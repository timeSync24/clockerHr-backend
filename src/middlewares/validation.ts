// src/middlewares/validation.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateCompanySignup = [
  body('companyName').not().isEmpty().withMessage('Company name is required'),
  body('domain').not().isEmpty().withMessage('Domain is required'),
  body('street').not().isEmpty().withMessage('Street is required'),
  body('city').not().isEmpty().withMessage('City is required'),
  body('state').not().isEmpty().withMessage('State is required'),
  body('postalCode').not().isEmpty().withMessage('Postal code is required'),
  body('country').not().isEmpty().withMessage('Country is required'),
  body('phone').not().isEmpty().withMessage('Phone number is required'),
  body('firstName').not().isEmpty().withMessage('First name is required'),
  body('lastName').not().isEmpty().withMessage('Last name is required'),
  body('adminEmail').isEmail().withMessage('Valid admin email is required'),
  body('adminPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
