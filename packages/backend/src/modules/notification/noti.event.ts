import EventEmitter from "events";
import { SendMessageNotificationI, SendTokenNotificationI } from "../authentication/auth.model";
import logger from "../../globals/utils/logger";
import notificationGateway from "./noti.gateway";

const notificationEventEmitter = new EventEmitter();

notificationEventEmitter.on("send-otp-email", async (data: SendTokenNotificationI) => {
    try {
        const res = await notificationGateway.sendEmailToken(data.emails, data.token, data.subject);
        logger.info(JSON.stringify(res));
    } catch (error) {
        logger.error("[NotificationException]", error);
    }
});

notificationEventEmitter.on("send-info-email", async(data: SendMessageNotificationI) => {
    try {
        const res = await notificationGateway.sendEmailToken(data.emails, data.message, data.subject);
        logger.info(JSON.stringify(res));
    } catch (error) {
        logger.error("[NotificationException]", error);
    }
});

export default notificationEventEmitter;