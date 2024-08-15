import mongoose from 'mongoose';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function createLogaxpAdmin() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to the database.');

    // Admin credentials (consider storing them securely or prompting the user)
    const adminEmail = 'admin@example.com';  // Replace with actual email or input method
    const adminPassword = 'StrongPassword123'; // Replace with actual password or input method
    const firstName = 'Admin';
    const lastName = 'User';

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create the LogaxpAdmin user
    const adminUser = new User({
      firstName,
      lastName,
      email: adminEmail,
      password: hashedPassword,
      role: 'LogaxpAdmin',
      isVerified: true,
      status: 'Active',
      companies: [], // LogaxpAdmin should not have any associated companies
    });

    // Save the LogaxpAdmin user to the database
    await adminUser.save();
    console.log('LogaxpAdmin created successfully.');
  } catch (error) {
    console.error('Error creating LogaxpAdmin:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Run the script
createLogaxpAdmin();
