import nodemailer from 'nodemailer';
import type Mail from "nodemailer/lib/mailer";
import { GMAIL_USER_ADDRESS, GMAIL_USER_APP_PASSWORD } from '@/constants/server';

// GMAIL Client
// @see https://miracleio.me/snippets/use-gmail-with-nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER_ADDRESS,
    pass: GMAIL_USER_APP_PASSWORD,
  }
});

// Sender Function
/**
 * @returns Returns a Promise that always resolve, with a `boolean` indicating whether the email was sent or not
 */
export async function sendMailWithGmail(mailData: Mail.Options) {
  return new Promise<boolean>((resolve) => {
    transporter.sendMail(mailData,
      (error, info) => {
        if (error) {
          console.log({ who: "sendMailWithGmail", emailSent: false });
          resolve(false);
        }
        else {
          console.log('Email sent: ' + info.response);
          resolve(true);
        }
      });
  });
}