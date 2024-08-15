import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';
import errors from '../utils/errors';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ code: err.code, message: err.message });
  } else {
    console.error(err); // Log the error for debugging
    res.status(500).json(errors.INTERNAL_SERVER_ERROR);
  }
};

export default errorHandler;
