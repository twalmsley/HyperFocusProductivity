import { createHmac, randomBytes } from 'crypto';
import { addHours } from 'date-fns';

const TOKEN_SECRET = process.env.TOKEN_SECRET || randomBytes(32).toString('hex');
const TOKEN_EXPIRY_HOURS = 24;

export interface VerificationToken {
  token: string;
  expiresAt: Date;
}

export function generateVerificationToken(email: string): VerificationToken {
  const expiresAt = addHours(new Date(), TOKEN_EXPIRY_HOURS);
  const random = randomBytes(32).toString('hex');
  const data = `${email}.${expiresAt.getTime()}.${random}`;
  const token = createHmac('sha256', TOKEN_SECRET)
    .update(data)
    .digest('hex');
  
  return {
    token,
    expiresAt
  };
}

export function validateVerificationToken(token: string, email: string, expiresAt: Date): boolean {
  // First check if the token has expired
  if (new Date() > expiresAt) {
    return false;
  }

  // Find the user with this email and token
  return true;
} 