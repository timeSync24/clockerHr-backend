import { Request, Response, NextFunction } from 'express';
import UserService from '../services/userService';
import { sendResetPasswordEmail, sendVerificationEmail } from '../utils/emailService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import errors from '../utils/errors';
import CustomError from '../utils/CustomError';
import { TokenPayload } from '../types/token';
import { generateAuthToken } from '../utils/token';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Function to hash password
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Login with 2FA and backup codes
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, token, backupCode } = req.body;
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new CustomError(errors.INVALID_CREDENTIALS);
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new CustomError(errors.ACCOUNT_LOCKED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock account for 15 minutes
      }
      await user.save();
      throw new CustomError(errors.INVALID_CREDENTIALS);
    }

        // Example backend response
      if (user.is2FAEnabled) {
        if (backupCode) {
          const isValidBackupCode = await user.validateBackupCode(backupCode);
          if (!isValidBackupCode) {
            throw new CustomError(errors.INVALID_2FA_TOKEN);
          }
        } else if (token) {
          const verified = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: 'base32',
            token,
          });

          if (!verified) {
            throw new CustomError(errors.INVALID_2FA_TOKEN);
          }
        } else {
          return res.status(200).json({ message: '2FA_REQUIRED' });
        }
      }
        
    user.failedLoginAttempts = 0; // Reset failed login attempts on successful login
    user.lockUntil = null; // Reset lockUntil on successful login
    await user.save();

    const companyIds = user.companies.map((company: any) => company._id.toString());

    const authToken = generateAuthToken(
      user._id.toString(),
      user.role,
      companyIds,
      user.firstName,
      user.lastName,
      user.email,
      user.isVerified,
      user.profilePicture,
      user.status
    );

    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 5, // 5 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });

    const userObject = { ...user.toObject() };
    delete userObject.password;

    res.json({
      message: 'Login successful',
      user: userObject,
      companies: user.companies // Include populated companies
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.cookie('token', '', { maxAge: 0 });
  res.json({ message: 'Logout successful' });
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    await sendResetPasswordEmail(user.email, resetToken);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    const user = await UserService.getUserById(decoded.userId, [], 'logaxpAdmin');

    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }

    // Set the new password
    user.password = newPassword;  // This triggers the pre-save hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};


export const session = async (req: Request, res: Response) => {
  if (req.user) {
    const userObject = { ...req.user };
    delete userObject.password; // Remove password from the user object
    res.json({ user: userObject });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export const enable2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, companyIds, role } = req.user as TokenPayload;
    const user = await UserService.getUserById(userId, companyIds, role);
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }

    // Generate the secret for 2FA
    const secret = speakeasy.generateSecret({
      name: `ClockerHR (${user.email})`,
      issuer: 'ClockerHR',
    });

    // Store the secret in the user's document
    user.twoFASecret = secret.base32; // Store the base32 encoded secret
    user.is2FAEnabled = true;
    await user.save();

    // Generate the otpauth URL for the QR code
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32, // Use the base32 encoded secret here
      label: `ClockerHR (${user.email})`, // Custom label
      issuer: 'ClockerHR', // Custom issuer
      encoding: 'base32',
    });

    // Convert the otpauth URL to a QR code data URL
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
    
    // Generate backup codes if necessary
    const backupCodes = await user.generateBackupCodes();

    // Return QR code URL and backup codes
    res.json({ qrCodeUrl, backupCodes });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const { userId, companyIds, role } = req.user as TokenPayload;
    const user = await UserService.getUserById(userId, companyIds, role);
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      throw new CustomError(errors.INVALID_2FA_TOKEN);
    }

    res.json({ message: '2FA verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const disable2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, companyIds, role } = req.user as TokenPayload;
    const user = await UserService.getUserById(userId, companyIds, role);
    if (!user) {
      throw new CustomError(errors.USER_NOT_FOUND);
    }

    user.is2FAEnabled = false;
    user.twoFASecret = '';
    user.backupCodes = []; // Clear backup codes
    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    next(error);
  }
};
