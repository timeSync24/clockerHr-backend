import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/token';

export const generateVerificationToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const generateAuthToken = (
  userId: string,
  role: string,
  companyIds: string[],
  firstName: string,
  lastName: string,
  email: string,
  isVerified: boolean,
  profilePicture: string,
  status: string
): string => {
  return jwt.sign(
    {
      userId,
      role,
      companyIds,
      firstName,
      lastName,
      email,
      isVerified,
      profilePicture,
      status,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '5h' }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    console.log(`Verifying token: ${token}`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    console.log('Token verified successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid token');
  }
};
