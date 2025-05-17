import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.APP_URL}/verify?token=${token}`;
  
  const mailOptions = {
    from: 'noreply@aosd.co.uk',
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to Hyper Focus!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
} 