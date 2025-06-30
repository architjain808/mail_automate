// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { Users } from 'src/interface/users';
import { Recruiter } from 'src/interface/recruiter';
import { console } from 'inspector';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AesService } from './enc-dec.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterEntity } from 'src/entities/UserRegister.entity';
import { Repository } from 'typeorm';
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private aesService: AesService,
    @InjectRepository(UserRegisterEntity)
    private readonly userRepo: Repository<UserRegisterEntity>,
  ) {}

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_9AM)
  async handleEmailSend() {
    // const allUsers: Users[] = JSON.parse(
    //   fs.readFileSync('./src/Data/users.json', 'utf-8'),
    // );
    let allUsers: any = [];
    await this.userRepo
      .find()
      .then((res) => {
        allUsers = res;
      })
      .catch((err) => {
        this.logger.error(err);
      });
    const allRecuretors: Recruiter[] = JSON.parse(
      fs.readFileSync('./src/Data/allmails.json', 'utf-8'),
    );
    for (const user of allUsers) {
      const mailStatingIndex = user?.mailIndex;

      const filteredList = allRecuretors.filter(
        (rec) => rec?.index > mailStatingIndex,
      );
      const finalMailArray = filteredList.splice(0, 30);
      const userTranspoter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: user?.useremail,
          pass: this.aesService.decrypt(user?.appPassword),
        },
      });
      await this.sendEmailsOneByOne(user, userTranspoter, finalMailArray);
      await this.updateUserFile(user, 'mailIndex', +user?.mailIndex + 30);
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
      await this.sleep(3000);
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

  updateUserFile(userData, key, newValue) {
    const new_userData = { ...userData, [key]: newValue };
    return this.userRepo.update(userData?.user_id, new_userData);
  }
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
