import { PrismaClient } from '@prisma/client';
import { validateVerificationToken } from '~/server/utils/emailVerification';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Try to get token from query parameters first, then from body
    const query = getQuery(event);
    const body = await readBody(event);
    const token = query.token || body.token;

    if (!token) {
      throw createError({
        statusCode: 400,
        message: 'Verification token is required',
      });
    }

    // Find user with the verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Invalid verification token',
      });
    }

    if (!user.verificationTokenExpires) {
      throw createError({
        statusCode: 400,
        message: 'Invalid verification token',
      });
    }

    // Validate the token
    const isValid = validateVerificationToken(
      token,
      user.id,
      user.verificationTokenExpires
    );

    if (!isValid) {
      throw createError({
        statusCode: 400,
        message: 'Verification token has expired',
      });
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully',
    };
  } catch (error: any) {
    console.error('Verification error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred during verification',
    });
  }
}); 