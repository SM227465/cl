import { EmailConfig } from '../interfaces/email.interface';

export const MAILGUN_CONFIG: EmailConfig = {
  host: process.env.PROD_EMAIL_HOST!,
  port: 587,
  secure: false,
  auth: {
    user: process.env.PROD_EMAIL_USER!,
    pass: process.env.PROD_EMAIL_PASS!,
  },
};

export const MAILTRAP_CONFIG: EmailConfig = {
  host: process.env.DEV_EMAIL_HOST!,
  port: 587,
  secure: false,
  auth: {
    user: process.env.DEV_EMAIL_USER!,
    pass: process.env.DEV_EMAIL_PASS!,
  },
};

export const emailConfig = {
  from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
  production: process.env.NODE_ENV === 'production' ? MAILGUN_CONFIG : MAILTRAP_CONFIG,
};
