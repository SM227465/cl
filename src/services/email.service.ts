import { createTransport, Transporter } from 'nodemailer';
import { emailConfig } from '../configs/email.config';
import { MailParamsMap, MailType } from '../interfaces/email.interface';
import logger from '../utils/logger.util';
import { TemplateService } from './template.service';

export class EmailService {
  private static instance: EmailService;
  private transporter: Transporter;
  private templateService: TemplateService;

  private constructor() {
    this.transporter = createTransport(emailConfig.production);
    this.templateService = TemplateService.getInstance();
    this.verifyConnection();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection established');
    } catch (error) {
      logger.error('Email service connection failed:', error);
      throw new Error('Failed to establish email service connection');
    }
  }

  private async prepareEmail<T extends MailType>(
    mailType: T,
    payload: MailParamsMap[T]
  ): Promise<{
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
  }> {
    try {
      const html = await this.templateService.getTemplate(mailType, payload);

      return {
        from: emailConfig.from,
        to: payload.toMail,
        subject: payload.subject,
        html,
        text: '', // You might want to add text version generation
      };
    } catch (error) {
      throw new Error('Failed to prepare email');
    }
  }

  public async sendMail<T extends MailType>(mailType: T, params: MailParamsMap[T]): Promise<void> {
    try {
      const mailOptions = await this.prepareEmail(mailType, params);
      await this.transporter.sendMail(mailOptions);

      logger.info(`${mailType} email sent to => ${params.toMail}`);
    } catch (error) {
      console.log(error);

      logger.error(`Failed to send ${mailType} email to ${params.toMail}`);
      throw new Error('Failed to send email', { cause: error });
    }
  }
}
