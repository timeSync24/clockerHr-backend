// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import UserService from '../services/userService';
import CustomError from '../utils/CustomError';
import { assertIsDefined } from '../assert';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { IUser } from '../models/userModel';
import mongoose from 'mongoose';
import { pipeline } from 'stream';
import { promisify } from 'util';
import errors from '../utils/errors';

const pipelineAsync = promisify(pipeline);

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertIsDefined(req.user, 'User is not authenticated');
    console.log("Authenticated user:", req.user);

    const users = await UserService.getUsersByCompany(req.user.companyIds, req.user.role);
    console.log("Fetched users:", users);

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};

export const getTenantAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertIsDefined(req.user, 'User is not authenticated');

    // Ensure only LogaxpAdmin can access this route
    if (req.user.role !== 'LogaxpAdmin') {
      throw new CustomError(errors.FORBIDDEN);
    }

    // Fetch Tenant-Admins along with their associated company names
    const tenantAdmins = await UserService.getTenantAdmins();

    // Return the response
    res.json(tenantAdmins);
  } catch (error) {
    next(error);
  }
};



export const deactivateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await UserService.deactivateUser(id);
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    res.status(200).json({ message: 'User deactivated successfully', user });
  } catch (error) {
    next(error);
  }
};

export const reactivateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await UserService.reactivateUser(id);
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    res.status(200).json({ message: 'User reactivated successfully', user });
  } catch (error) {
    next(error);
  }
};


export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertIsDefined(req.user, 'User is not authenticated');
    const user = await UserService.getUserById(req.params.id, req.user.companyIds, req.user.role);
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertIsDefined(req.user, 'User is not authenticated');
    const newUser = await UserService.createUser(req.body, req.user.companyIds, req.user.role);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertIsDefined(req.user, 'User is not authenticated');
    const updatedUser = await UserService.updateUser(req.params.id, req.body, req.user.companyIds, req.user.role);
    if (!updatedUser) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertIsDefined(req.user, 'User is not authenticated');
    const deletedUser = await UserService.deleteUser(req.params.id, req.user.companyIds, req.user.role);
    if (!deletedUser) {
      throw new CustomError(errors.USER_NOT_FOUND);
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
      throw new CustomError(errors.TOKEN_INVALID);
    }
    await UserService.verifyEmail(token as string);
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

// Validation logic for each row
function validateRow(row: any): boolean {
  // Add your validation logic here, such as checking required fields or validating email format
  return row.email && row.firstName && row.lastName;
}

export const bulkCreateUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure the user is authenticated and a file has been uploaded
    assertIsDefined(req.user, 'User is not authenticated');
    assertIsDefined(req.file, 'No file uploaded');

    const filePath = path.join(__dirname, '../../uploads', req.file.filename);
    console.log('File path:', filePath);

    const users: Partial<IUser>[] = [];
    const companyIds = req.user.companyIds.map(id => new mongoose.Types.ObjectId(id));

    // Use pipelineAsync for processing the file
    await pipelineAsync(
      fs.createReadStream(filePath),
      csv(),
      async function* (source) {
        for await (const row of source) {
          if (validateRow(row)) {
            users.push({
              firstName: row.firstName,
              lastName: row.lastName,
              middleName: row.middleName,
              email: row.email,
              password: row.password,
              role: row.role,
              companies: companyIds,
            });
          }
        }
      }
    );

    // Batch insert users into the database
    const batchSize = 100; // Set the batch size according to preference
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await UserService.bulkCreateUsers(batch);
    }

    // Send a success response
    res.status(201).json({ message: 'Users created successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    next(error);
  }
};

export const inviteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertIsDefined(req.user, 'User is not authenticated');
    const { email, role } = req.body;
    await UserService.inviteUser(email, role, req.user.companyIds);
    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password, firstName, lastName } = req.body;
    const user = await UserService.acceptInvitation(token, password, firstName, lastName);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};


// src/controllers/userController.ts
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }

    const user = await UserService.getUserProfile(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId; 
    if (!userId) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }

    const updatedUser = await UserService.updateUserProfile(userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};