import nodemailer from 'nodemailer';

// Validate required environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '))
  throw new Error('Missing required SMTP configuration')
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

// Verify SMTP connection on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error)
  } else {
    console.log('SMTP server is ready to take our messages')
  }
})

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL,
    subject: `Contact Form: ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error('Error sending contact email:', error);
    throw new Error(`Failed to send contact email: ${error.message || 'Unknown error'}`);
  }
} 