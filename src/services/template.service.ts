import * as path from 'path';
import * as fs from 'fs/promises';
import { MailParamsMap, MailType } from '../interfaces/email.interface';

export class TemplateService {
  private static instance: TemplateService;
  private templateCache: Map<string, string> = new Map();

  private constructor() {}

  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  private async loadTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
    return await fs.readFile(templatePath, 'utf-8');
  }

  public async getTemplate<T extends MailType>(mailType: T, payload: MailParamsMap[T]): Promise<string> {
    try {
      // Get template from cache or load it
      let template = this.templateCache.get(mailType);

      if (!template) {
        template = await this.loadTemplate(mailType);
        this.templateCache.set(mailType, template);
      }

      // Type-safe template processing
      return Object.entries(payload).reduce((html, [key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        return html.replace(regex, String(value));
      }, template);
    } catch (error) {
      throw new Error(`Failed to process template: ${mailType}`);
    }
  }
}
