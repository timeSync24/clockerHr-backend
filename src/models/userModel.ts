import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { CallbackError } from 'mongoose';
import CustomError from '../utils/CustomError'; // Assuming you have a custom error utility

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  role: 'Admin' | 'Employee' | 'LogaxpAdmin' | 'Tenant-Admin';
  isVerified: boolean;
  companies: mongoose.Types.ObjectId[];
  profilePicture: string;
  passwordHistory: string[];
  status: 'Active' | 'Inactive';
  is2FAEnabled: boolean;
  twoFASecret: string;
  backupCodes: string[]; // Array to store hashed backup codes
  failedLoginAttempts: number;
  lockUntil: Date | null;
  comparePassword: (password: string) => Promise<boolean>;
  checkLockout: () => void;
  incrementLoginAttempts: () => Promise<void>;
  generateBackupCodes: () => Promise<string[]>;
  validateBackupCode: (code: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Admin', 'Employee', 'LogaxpAdmin', 'Tenant-Admin'] },
    isVerified: { type: Boolean, default: false },
    companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
    profilePicture: { type: String, required: false },
    passwordHistory: [{ type: String, required: false }],
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    is2FAEnabled: { type: Boolean, default: false },
    twoFASecret: { type: String, required: false },
    backupCodes: [{ type: String, required: false }], // Store hashed backup codes
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next: (err?: CallbackError) => void) {
  const user = this as IUser;
  
  // If password hasn't been modified, continue to next middleware
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Check if the new password is not the same as any previous passwords
    const isPreviousPassword = await Promise.all(
      user.passwordHistory.map(async (oldPassword) => bcrypt.compare(user.password, oldPassword))
    );

    if (isPreviousPassword.some((result) => result)) {
      throw new Error('New password must be different from the previous passwords');
    }

    // Save the new password and update password history
    user.passwordHistory = [hashedPassword, ...user.passwordHistory].slice(0, 5);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});


userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.checkLockout = function () {
  if (this.lockUntil && this.lockUntil > Date.now()) {
    throw new CustomError('Account is locked. Please try again later.');
  }
};


userSchema.methods.incrementLoginAttempts = async function () {
  const LOCK_TIME = 15 * 60 * 1000; // 15 minutes lock time

  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.failedLoginAttempts = 1;
    this.lockUntil = null;
  } else {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5 && !this.lockUntil) {
      this.lockUntil = new Date(Date.now() + LOCK_TIME);
    }
  }

  await this.save();
};

userSchema.methods.generateBackupCodes = async function (): Promise<string[]> {
  const user = this as IUser;
  const backupCodes = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 10); // Generate a random 8-character code
    backupCodes.push(code);
    user.backupCodes.push(await bcrypt.hash(code, 10)); // Store hashed code in DB
  }
  await user.save();
  return backupCodes;
};

userSchema.methods.validateBackupCode = async function (code: string): Promise<boolean> {
  const user = this as IUser;
  for (const storedCode of user.backupCodes) {
    if (await bcrypt.compare(code, storedCode)) {
      user.backupCodes = user.backupCodes.filter(c => c !== storedCode); // Remove used code
      await user.save();
      return true;
    }
  }
  return false;
};

// Adding indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ companies: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model<IUser>('User', userSchema);
export default User;
