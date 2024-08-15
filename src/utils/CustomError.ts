import { ErrorDetail } from '../types/errors';

class CustomError extends Error {
  code: string;
  statusCode: number;

  constructor(errorDetail: ErrorDetail | string) {
    if (typeof errorDetail === 'string') {
      super(errorDetail);
      this.code = 'GENERAL_ERROR';
      this.statusCode = 400; // Default status code
    } else {
      super(errorDetail.message);
      this.code = errorDetail.code;
      this.statusCode = errorDetail.statusCode;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
