import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve('./src/utils/emailTemplates'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./src/utils/emailTemplates'),
  extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{ filename: string; path: string; cid: string }>;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Email Verification',
    html: `<p>Please verify your email by clicking the link below:</p><a href="${process.env.BASE_URL}/api/v1/users/verify-email?token=${token}">Verify Email</a>`,
    attachments: [{
      filename: 'logo.png',
      path: path.resolve(__dirname, '../assets/images/blue.png'),
      cid: 'logo'
    }],
  });
};

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Password Reset',
    html: `<p>Please reset your password by clicking the link below:</p><a href="${process.env.BASE_URL}/reset-password?token=${token}">Reset Password</a>`,
    attachments: [{
      filename: 'logo.png',
      path: path.resolve(__dirname, '../assets/images/blue.png'),
      cid: 'logo'
    }],
  });
};

export { sendEmail };


export const sendInvitationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Invitation',
    text: `You have been invited to join. Please use the following link to create your account: ${process.env.CLIENT_URL}/accept-invitation?token=${token}`,
    html: `<p>You have been invited to join. Please use the following link to create your account:</p>
           <a href="${process.env.CLIENT_URL}/accept-invitation?token=${token}">Create Account</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}: `, error);
    throw new Error('Failed to send invitation email');
  }
};