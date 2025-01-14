import { TypeOf } from "zod";
import authSchema from "./auth.schema";

export interface SendTokenNotificationI {
  emails: string[];
  subject: string;
  token: string;
}

export interface SendMessageNotificationI {
  emails: string[];
  subject: string;
  message: string;
}

export type VerifyAccountModel = TypeOf<
  typeof authSchema.verifyAccountSchema
>["body"] & { createdAt?: string; expiresAt: number };
