// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { Users } from 'src/interface/users';
import { Recruiter } from 'src/interface/recruiter';
import { console } from 'inspector';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AesService } from './enc-dec.service';
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private aesService: AesService) {}

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_12PM)
  async handleEmailSend() {
    const allUsers: Users[] = JSON.parse(
      fs.readFileSync('./src/Data/users.json', 'utf-8'),
    );
    const allRecuretors: Recruiter[] = JSON.parse(
      fs.readFileSync('./src/Data/allmails.json', 'utf-8'),
    );
    for (const user of allUsers) {
      const mailStatingIndex = user?.mailIndex;

      const filteredList = allRecuretors.filter(
        (rec) => rec?.index > mailStatingIndex,
      );
      const finalMailArray = filteredList.splice(0, 25);
      const userTranspoter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: user?.useremail,
          pass: this.aesService.decrypt(user?.appPassword),
        },
      });
      await this.sendEmailsOneByOne(user, userTranspoter, finalMailArray);
      this.updateUserFile(
        './src/Data/users.json',
        user?.useremail,
        'mailIndex',
        +user?.mailIndex + 25,
        
      );
    }
  }

  async sendEmailsOneByOne(
    user: Users,
    transporter: any,
    allMailArray: Recruiter[],
  ) {
    for (const rec of allMailArray) {
      const mailOption = {
        from: user?.useremail,
        to: rec?.email,
        subject: this.parseTemplate(user?.subject, rec),
        text: this.parseTemplate(user?.text, rec),
      };
      try {
        const info = await transporter.sendMail(mailOption);
        this.logger.log(
          `Email sent from ${mailOption?.from} to ${mailOption?.to}: ${info.response}`,
        );
      } catch (err) {
        this.logger.error(
          `Error sending email from ${mailOption?.from} to${mailOption?.to}:`,
          err.message,
        );
      }
      this.sleep(3000);
    }
  }

  /**
   *
   * @param template texy
   * @param contact saved details
   * @returns paresed mail
   */
  parseTemplate(template: string, contact: Recruiter): string {
    return template
      .replace(/\$\{contact\.name\}/g, contact.name)
      .replace(/\$\{contact\.companyName\}/g, contact.companyName);
  }

  updateUserFile(filePath, useremail, key, newValue) {
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const item = rawData.find((obj: Users) => obj.useremail === useremail);
    if (item) {
      item[key] = newValue;

      fs.writeFileSync(filePath, JSON.stringify(rawData));
    }
  }
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
