// src/types/token.ts
export interface TokenPayload {
  userId: string;
  role: string;
  companyIds: string[];
  firstName: string;
  lastName: string;
  password?: string;
  email?: string;
}
