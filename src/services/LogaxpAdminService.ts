import User, { IUser } from '../models/userModel';
import CustomError from '../utils/CustomError';
import errors from '../utils/errors';
import mongoose from'mongoose';

class LogaxpAdminService {
  public async getAllLogaxpAdmins(): Promise<IUser[]> {
    return User.find({ role: 'LogaxpAdmin' });
  }

  public async createLogaxpAdmin(userData: Partial<IUser>): Promise<IUser> {
    const newUser = new User({
      ...userData,
      role: 'LogaxpAdmin',
      companies: [], // LogaxpAdmin doesn't belong to any company
      status: 'Active', // Default status to Active on creation
    });
    await newUser.save();
    return newUser;
  }

  public async updateLogaxpAdmin(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user || user.role !== 'LogaxpAdmin') {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    Object.assign(user, userData);
    await user.save();
    return user;
  }

  public async deleteLogaxpAdmin(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user || user.role !== 'LogaxpAdmin') {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    await User.findByIdAndDelete(id);
    return user;
  }

  public async getLogaxpAdminById(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user || user.role !== 'LogaxpAdmin') {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    return user;
  }

  // Activate a LogaxpAdmin
  public async activateLogaxpAdmin(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user || user.role !== 'LogaxpAdmin') {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    user.status = 'Active';
    await user.save();
    return user;
  }

  // Deactivate a LogaxpAdmin
  public async deactivateLogaxpAdmin(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user || user.role !== 'LogaxpAdmin') {
      throw new CustomError(errors.USER_NOT_FOUND);
    }
    user.status = 'Inactive';
    await user.save();
    return user;
  }

  // Get all active LogaxpAdmins
  public async getActiveLogaxpAdmins(): Promise<IUser[]> {
    return User.find({ role: 'LogaxpAdmin', status: 'Active' });
  }public async getTotalUsersPerCompany(): Promise<{
    companyName: string;
    domain: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    admin: mongoose.Types.ObjectId;
    userCount: number;
    status: string;
  }[]> {
    const userAggregation = await User.aggregate([
      {
        $unwind: "$companies", // Unwind the companies array to create separate documents for each company
      },
      {
        $lookup: {
          from: "companies", // Assuming your company model is stored in a collection called 'companies'
          localField: "companies", // Field from the User collection
          foreignField: "_id", // Field from the Company collection
          as: "companyDetails", // The result of the lookup will be stored in this field
        },
      },
      {
        $group: {
          _id: "$companies", // Group by company ID
          companyName: { $first: "$companyDetails.companyName" }, // Get the company name from the first element of the companyDetails array
          domain: { $first: "$companyDetails.domain" }, // Get the domain
          street: { $first: "$companyDetails.street" }, // Get the street
          city: { $first: "$companyDetails.city" }, // Get the city
          state: { $first: "$companyDetails.state" }, // Get the state
          postalCode: { $first: "$companyDetails.postalCode" }, // Get the postal code
          country: { $first: "$companyDetails.country" }, // Get the country
          phone: { $first: "$companyDetails.phone" }, // Get the phone
          admin: { $first: "$companyDetails.admin" }, // Get the admin
          userCount: { $sum: 1 }, // Sum the number of users for each company
          status: { $first: "$status" }, // Get the status from the first user in the group
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          companyName: { $arrayElemAt: ["$companyName", 0] }, // Since companyName is an array, we take the first element
          domain: { $arrayElemAt: ["$domain", 0] }, // Take the first element for domain
          street: { $arrayElemAt: ["$street", 0] }, // Take the first element for street
          city: { $arrayElemAt: ["$city", 0] }, // Take the first element for city
          state: { $arrayElemAt: ["$state", 0] }, // Take the first element for state
          postalCode: { $arrayElemAt: ["$postalCode", 0] }, // Take the first element for postal code
          country: { $arrayElemAt: ["$country", 0] }, // Take the first element for country
          phone: { $arrayElemAt: ["$phone", 0] }, // Take the first element for phone
          admin: { $arrayElemAt: ["$admin", 0] }, // Take the first element for admin
          userCount: 1, // Include the userCount field in the output
          status: 1, // Include the status field in the output
        },
      },
    ]);
  
    return userAggregation;
  }
  
}  



export default new LogaxpAdminService();
