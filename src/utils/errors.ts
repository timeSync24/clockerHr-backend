// src/utils/errors.ts
import { ErrorMap } from '../types/errors';

const errors: ErrorMap = {
  // General Errors
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
    statusCode: 500,
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Unauthorized access.',
    statusCode: 401,
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'Forbidden access.',
    statusCode: 403,
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found.',
    statusCode: 404,
  },

  // User Errors
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'The user you are looking for does not exist.',
    statusCode: 404,
  },
  INVALID_USER_INPUT: {
    code: 'INVALID_USER_INPUT',
    message: 'The input provided for the user is invalid.',
    statusCode: 400,
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: 'A user with this email already exists.',
    statusCode: 409,
  },
  ACCOUNT_LOCKED: {
    code: 'ACCOUNT_LOCKED',
    message: 'Account is locked due to multiple failed login attempts. Please try again later.',
    statusCode: 403,
  },
  INVALID_2FA_TOKEN: {
    code: 'INVALID_2FA_TOKEN',
    message: 'Invalid 2FA token.',
    statusCode: 401,
  },

  // Company Errors
  COMPANY_NOT_FOUND: {
    code: 'COMPANY_NOT_FOUND',
    message: 'The company you are looking for does not exist.',
    statusCode: 404,
  },
  INVALID_COMPANY_INPUT: {
    code: 'INVALID_COMPANY_INPUT',
    message: 'The input provided for the company is invalid.',
    statusCode: 400,
  },
  COMPANY_ALREADY_EXISTS: {
    code: 'COMPANY_ALREADY_EXISTS',
    message: 'A company with this name already exists.',
    statusCode: 409,
  },

  // Employee Errors
  EMPLOYEE_NOT_FOUND: {
    code: 'EMPLOYEE_NOT_FOUND',
    message: 'The employee you are looking for does not exist.',
    statusCode: 404,
  },
  INVALID_EMPLOYEE_INPUT: {
    code: 'INVALID_EMPLOYEE_INPUT',
    message: 'The input provided for the employee is invalid.',
    statusCode: 400,
  },
  EMPLOYEE_ALREADY_EXISTS: {
    code: 'EMPLOYEE_ALREADY_EXISTS',
    message: 'An employee with this email already exists.',
    statusCode: 409,
  },

  // Time and Attendance Errors
  ATTENDANCE_RECORD_NOT_FOUND: {
    code: 'ATTENDANCE_RECORD_NOT_FOUND',
    message: 'The attendance record you are looking for does not exist.',
    statusCode: 404,
  },
  INVALID_ATTENDANCE_INPUT: {
    code: 'INVALID_ATTENDANCE_INPUT',
    message: 'The input provided for the attendance record is invalid.',
    statusCode: 400,
  },
  ATTENDANCE_RECORD_ALREADY_EXISTS: {
    code: 'ATTENDANCE_RECORD_ALREADY_EXISTS',
    message: 'An attendance record for this date already exists.',
    statusCode: 409,
  },

  // Notification Errors
  NOTIFICATION_NOT_FOUND: {
    code: 'NOTIFICATION_NOT_FOUND',
    message: 'The notification you are looking for does not exist.',
    statusCode: 404,
  },
  INVALID_NOTIFICATION_INPUT: {
    code: 'INVALID_NOTIFICATION_INPUT',
    message: 'The input provided for the notification is invalid.',
    statusCode: 400,
  },

  // Role Errors
  ROLE_NOT_FOUND: {
    code: 'ROLE_NOT_FOUND',
    message: 'The role you are looking for does not exist.',
    statusCode: 404,
  },
  INVALID_ROLE_INPUT: {
    code: 'INVALID_ROLE_INPUT',
    message: 'The input provided for the role is invalid.',
    statusCode: 400,
  },
  ROLE_ALREADY_EXISTS: {
    code: 'ROLE_ALREADY_EXISTS',
    message: 'A role with this name already exists.',
    statusCode: 409,
  },

  // Authentication and Authorization Errors
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'The credentials provided are invalid.',
    statusCode: 401,
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'The authentication token has expired.',
    statusCode: 401,
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'The authentication token is invalid.',
    statusCode: 401,
  },

  // Validation Errors
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Validation error occurred.',
    statusCode: 400,
  },

  // Database Errors
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'An error occurred while interacting with the database.',
    statusCode: 500,
  },
};

export default errors;
