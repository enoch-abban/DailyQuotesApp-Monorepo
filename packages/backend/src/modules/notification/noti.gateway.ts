import {createTransport} from "nodemailer"
import logger from "../../globals/utils/logger";
import { APP_NAME } from "../../config/project.config";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";

const notificationGateway = (function(){

    let gmailTransporter = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        }
    })

    const sendEmail = (mailOptions: {}, resolve: (arg0: SentMessageInfo) => void, reject: (arg0: unknown) => void) => {
        try {
            gmailTransporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(JSON.stringify({name: error.name, message: error.message, stack: error.stack}));
                    return reject(error);
                }
                return resolve(info);
            })
        } catch (error) {
            return reject(error);
        }
    }

    const sendEmailToken = (emails: string[], token: string, subject: string) => {
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

    const sendEmailIfo = (emails: string[], message: string, subject: string) => {
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

    return {
        sendEmailToken,
        sendEmailIfo
    }
})();

export default notificationGateway;