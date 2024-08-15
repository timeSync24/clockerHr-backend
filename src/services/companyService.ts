// src/services/companyService.ts
import mongoose from 'mongoose';
import Company, { ICompany } from '../models/companyModel';
import User, { IUser } from '../models/userModel';
import { sendVerificationEmail } from '../utils/emailService';
import { generateVerificationToken } from '../utils/token';
import dotenv from 'dotenv';

dotenv.config();

export const createCompany = async (companyData: any): Promise<ICompany> => {
  const { companyName, domain, street, city, state, postalCode, country, phone, firstName, lastName, middleName, adminEmail, adminPassword } = companyData;

  // Check if all required fields are provided
  if (!companyName || !street || !city || !state || !postalCode || !country || !phone || !firstName || !lastName || !adminEmail || !adminPassword) {
    throw new Error('All fields are required');
  }

  // Check if the company with the same name already exists
  const existingCompany = await Company.findOne({ companyName });
  if (existingCompany) {
    throw new Error('Company name must be unique');
  }

  // Create the Tenant-Admin user first and associate with the company
  const tenantAdminUser: IUser = new User({
    firstName,
    lastName,
    middleName,
    email: adminEmail,
    password: adminPassword, // Password will be hashed by pre-save hook
    role: 'Tenant-Admin',
    isVerified: false,
    companies: [], // Will be updated after the company is created
  });

  const savedTenantAdminUser = await tenantAdminUser.save();

  if (!savedTenantAdminUser._id) {
    throw new Error('Failed to save Tenant-Admin user');
  }

  // Create the company
  const company: ICompany = new Company({
    companyName,
    domain,
    street,
    city,
    state,
    postalCode,
    country,
    phone,
    admin: savedTenantAdminUser._id, // Set the Tenant-Admin ID
    employees: [savedTenantAdminUser._id], // Add the Tenant-Admin as the first employee
  });

  const savedCompany = await company.save();

  // Update the Tenant-Admin user with the company ID
  savedTenantAdminUser.companies = [savedCompany._id as mongoose.Types.ObjectId];
  await savedTenantAdminUser.save();

  // Send verification email
  const token = generateVerificationToken(savedTenantAdminUser._id.toString());
  await sendVerificationEmail(adminEmail, token);

  return savedCompany;
};

export const getCompanies = async (): Promise<ICompany[]> => {
  return await Company.find();
};

export const getCompanyById = async (id: string): Promise<ICompany | null> => {
  return await Company.findById(id);
};

export const updateCompany = async (id: string, companyData: any): Promise<ICompany | null> => {
  return await Company.findByIdAndUpdate(id, companyData, { new: true });
};

export const deleteCompany = async (id: string): Promise<ICompany | null> => {
  return await Company.findByIdAndDelete(id);
};
