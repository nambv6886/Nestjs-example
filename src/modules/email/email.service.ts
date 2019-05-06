import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { EMAIL_USERNAME, EMAIL_PASSWORD, HOST, PORT } from '../../config/environment';
import logger from '../../common/utils/logger';

@Injectable()
export class EmailService {
  constructor(
  ) {
  }
  private getTranporter() {
    return nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  public async sendMail(toEmail: string, subject: string, content: string): Promise<void> {
    const options = {
      from: EMAIL_USERNAME,
      to: toEmail,
      subject,
      text: content
    }
    return new Promise(async (resolve, reject) => {
      this.getTranporter().sendMail(options, (err, infor) => {
        if(err) {
          logger.error(`[EmailService][getMailTranporter]: Error ${JSON.stringify(err)}`);
        } else {
          logger.info(`[EmailService][sendMail]: Send mail to ${toEmail}`);
          resolve();
        } 
      })
    });
  }
}
