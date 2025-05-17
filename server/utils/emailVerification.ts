import { createHmac, randomBytes } from 'crypto';
import { addHours } from 'date-fns';

const TOKEN_SECRET = process.env.TOKEN_SECRET || randomBytes(32).toString('hex');
const TOKEN_EXPIRY_HOURS = 24;

export interface VerificationToken {
  token: string;
  expiresAt: Date;
}

export function generateVerificationToken(userId: string): VerificationToken {
  const expiresAt = addHours(new Date(), TOKEN_EXPIRY_HOURS);
  const data = `${userId}.${expiresAt.getTime()}`;
  const token = createHmac('sha256', TOKEN_SECRET)
    .update(data)
    .digest('hex');
  
  return {
    token,
    expiresAt
  };
}

export function validateVerificationToken(token: string, userId: string, expiresAt: Date): boolean {
  const data = `${userId}.${expiresAt.getTime()}`;
  const expectedToken = createHmac('sha256', TOKEN_SECRET)
    .update(data)
    .digest('hex');
  
  return token === expectedToken && new Date() < expiresAt;
} 