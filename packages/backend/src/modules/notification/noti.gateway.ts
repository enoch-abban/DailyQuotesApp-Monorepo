import {createTransport} from "nodemailer"
import logger from "../../globals/utils/logger";
import { APP_NAME } from "../../config/project.config";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";
import { google } from "googleapis"
import { Options } from "nodemailer/lib/mailer";

const notificationGateway = (function(){

    // Less secure
    let gmailTransporter = createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        }
    });

    const createTransporter = async () => {
        const oauth2Client = new google.auth.OAuth2(
          process.env.APP_EMAIL_CLIENT_ID,
          process.env.APP_EMAIL_CLIENT_SECRET,
          "https://developers.google.com/oauthplayground"
        );
      
        oauth2Client.setCredentials({
          refresh_token: process.env.APP_EMAIL_REFRESH_TOKEN
        });
      
        const accessToken = await new Promise((resolve, reject) => {
          oauth2Client.getAccessToken((err, token) => {
            if (err) {
              reject();
            }
            resolve(token);
          });
        });
      
        const transporter = createTransport({
          service: "gmail",
          auth: {
            type: "oauth2",
            user: process.env.APP_EMAIL,
            accessToken: accessToken as string,
            clientId: process.env.APP_EMAIL_CLIENT_ID,
            clientSecret: process.env.APP_EMAIL_CLIENT_SECRET,
            refreshToken: process.env.APP_EMAIL_REFRESH_TOKEN

          },
        //   tls: {
        //     rejectUnauthorized: false
        //   }
        });
      
        return transporter;
      };

    const verifyUnsecureGmailTransporter = () => {
        return new Promise((resolve, reject) => {
            gmailTransporter.verify((error, success) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(success);
                }
            });
        });
    }
    
    const verifySecureGmailTransporter = async () => {
            let emailTransporter = await createTransporter();
            return new Promise((resolve, reject) => {
                emailTransporter.verify((error, success) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(success);
                    }
                });
            });
    }

    const sendEmail = (mailOptions: {}, resolve: (arg0: SentMessageInfo) => void, reject: (arg0: unknown) => void) => {
        try {
            gmailTransporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(JSON.stringify({name: error.name, message: error.message, stack: error.stack}));
                     reject(error);
                }
                 resolve(info);
            })
        } catch (error) {
             reject(error);
        }
    }

    const sendEmailSecure = async (emailOptions: Options, resolve: (arg0: SentMessageInfo) => void, reject: (arg0: any) => void) => {
        // let emailTransporter = await createTransporter();
        // await emailTransporter.sendMail(emailOptions);
        createTransporter().then((transporter) => {
            transporter.sendMail(emailOptions).then((info)=> {
                resolve(info);
            }).catch((err) => {});
        }).catch((error) => {
            reject(error);
        });
      };

    const sendEmailTokenUnsecure = (emails: string[], token: string, subject: string) => {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: `${APP_NAME} <${process.env.APP_EMAIL}>`,
                to: emails,
                subject: subject,
                html: `<p>Your onetime token is <b>${token}</b>. Enter this token into the app to complete the registration.</p><p>This token expires in <b>1 hour</b></p>`
            };

            sendEmail(mailOptions, resolve, reject);
        });
    }
    const sendEmailToken = (emails: string[], token: string, subject: string) => {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: `${APP_NAME} <${process.env.APP_EMAIL}>`,
                to: emails,
                subject: subject,
                html: `<p>Your onetime token is <b>${token}</b>. Enter this token into the app to complete the registration.</p><p>This token expires in <b>1 hour</b></p>`
            };

            sendEmailSecure(mailOptions, resolve, reject);
        });
    }

    const sendEmailInfoUnsecure = (emails: string[], message: string, subject: string) => {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: `${APP_NAME} <${process.env.APP_EMAIL}>`,
                to: emails,
                subject: subject,
                html: `<p>${message}</p>`
            };

            sendEmail(mailOptions, resolve, reject);
        });
    }
    const sendEmailInfo = (emails: string[], message: string, subject: string) => {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: `${APP_NAME} <${process.env.APP_EMAIL}>`,
                to: emails,
                subject: subject,
                html: `<p>${message}</p>`
            };

            sendEmailSecure(mailOptions, resolve, reject);
        });
    }

    return {
        sendEmailToken,
        sendEmailInfo,
        verifySecureGmailTransporter,
        sendEmailTokenUnsecure,
        sendEmailInfoUnsecure,
        verifyUnsecureGmailTransporter
    }
})();

export default notificationGateway;