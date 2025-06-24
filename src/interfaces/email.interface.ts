export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export type MailType = 'WELCOME' | 'RESET_PASSWORD';

interface WelcomeMailParams {
  toMail: string;
  firstName: string;
  lastName: string;
  subject: string;
}

interface ResetPasswordMailParams {
  toMail: string;
  firstName: string;
  resetUrl: string;
  subject: string;
  year: number;
}

export type MailParamsMap = {
  WELCOME: WelcomeMailParams;
  RESET_PASSWORD: ResetPasswordMailParams;
};
