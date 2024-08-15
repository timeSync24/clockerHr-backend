import User, { IUser } from '../models/userModel';
import CustomError from '../utils/CustomError';
import bcrypt from 'bcrypt';
import errors from '../utils/errors';
import { verifyToken } from '../utils/token';
import { TokenPayload } from '../types/token';
import { sendInvitationEmail } from '../utils/emailService';

import mongoose from'mongoose';
import jwt from 'jsonwebtoken';

class UserService {
  public async getUsersByCompany(companyIds: string[], role: string): Promise<IUser[]> {
    if (role === 'logaxpAdmin') {
      return User.find();
    }
    return User.find({ companies: { $in: companyIds } });
  }

  public async getUserById(id: string, companyIds: string[], role: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user || (role !== 'logaxpAdmin' && !user.companies.some(companyId => companyIds.includes(companyId.toString())))) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    return user;
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).populate('companies');
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    if (user.status === 'Inactive') {
      throw new CustomError(errors.USER_INACTIVE);
    }
    return user;
  }

  public async createUser(userData: Partial<IUser>, companyIds: string[], role: string): Promise<IUser> {
    if (role === 'LogaxpAdmin') {
      // LogaxpAdmin can create users of any role, including other LogaxpAdmins
      const newUser = new User({
        ...userData,
        companies: userData.role === 'LogaxpAdmin' ? [] : companyIds, // LogaxpAdmin doesn't have company IDs
      });
      await newUser.save();
      return newUser;
    } else {
      // Normal tenant logic
      if (!companyIds || !companyIds.length) {
        throw new CustomError('Company IDs are required');
      }
      const validCompanyIds = companyIds.map(id => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new CustomError(`Invalid company ID: ${id}`);
        }
        return new mongoose.Types.ObjectId(id);
      });

      const newUser = new User({ ...userData, companies: validCompanyIds });
      await newUser.save();
      return newUser;
    }
  }


  // Fetch Tenant-Admins only with company names
public async getTenantAdmins(): Promise<IUser[]> {
  return User.find({ role: 'Tenant-Admin' }).populate({
    path: 'companies',
    select: 'companyName',
  });
}

    public async deactivateUser(id: string): Promise<IUser | null> {
      const user = await User.findById(id);
      if (!user) {
        throw new CustomError(errors.USER_NOT_FOUND);
      }
      user.status = 'Inactive';
      await user.save();
      return user;
    }

    public async reactivateUser(id: string): Promise<IUser | null> {
      const user = await User.findById(id);
      if (!user) {
        throw new CustomError(errors.USER_NOT_FOUND);
      }
      user.status = 'Active';
      await user.save();
      return user;
    }

  public async inviteUser(email: string, role: string, companyIds: string[]): Promise<void> {
    const invitationToken = this.generateInvitationToken(email, role, companyIds);
    await sendInvitationEmail(email, invitationToken);
  }

  private generateInvitationToken(email: string, role: string, companyIds: string[]): string {
    return jwt.sign({ email, role, companyIds }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  }

  public async acceptInvitation(token: string, password: string, firstName: string, lastName: string): Promise<IUser> {
    console.log(`Accepting invitation with token: ${token}`);
    try {
      const decoded = verifyToken(token) as TokenPayload;
      console.log('Decoded token:', decoded);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email: decoded.email,
        role: decoded.role,
        companies: decoded.companyIds,
        password: hashedPassword,
        firstName,
        lastName,
        isVerified: true,
      });
      await user.save();
      return user;
    } catch (error) {
      console.error('Error in acceptInvitation:', error);
      throw new CustomError(errors.TOKEN_INVALID);
    }
  }

  public async updateUser(id: string, userData: Partial<IUser>, companyIds: string[], role: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user || (role !== 'logaxpAdmin' && !user.companies.some(companyId => companyIds.includes(companyId.toString())))) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    Object.assign(user, userData);
    await user.save();
    return user;
  }

  public async deleteUser(id: string, companyIds: string[], role: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user || (role !== 'logaxpAdmin' && !user.companies.some(companyId => companyIds.includes(companyId.toString())))) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    await User.findByIdAndDelete(id);
    return user;
  }

  public async verifyEmail(token: string): Promise<void> {
    try {
      const decoded = verifyToken(token) as TokenPayload;
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new CustomError(errors.USER_NOT_FOUND);
      }
      user.isVerified = true;
      await user.save();
    } catch (error) {
      throw new CustomError(errors.TOKEN_INVALID);
    }
  }

  public async bulkCreateUsers(users: Partial<IUser>[]): Promise<void> {
    for (const userData of users) {
      const newUser = new User(userData);
      await newUser.save();
    }
  }
  public async getUserProfile(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId).populate('companies');
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    if (user.status === 'Inactive') {
      throw new CustomError(errors.USER_INACTIVE);
    }
    return user;
  }

  public async updateUserProfile(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    Object.assign(user, userData);
    await user.save();
    return user;
  }
}

export default new UserService();
