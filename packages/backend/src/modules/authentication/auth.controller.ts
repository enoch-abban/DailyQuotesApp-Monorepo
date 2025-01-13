import { ApiResponse, ErrorResponse } from "@dqa/shared-data";
import { asyncHandler } from "../../globals/utils/asyncHandler";
import { CreateUserModel } from "../user/u.model";
import authService from "./auth.service";
import authenticationUtils from "../../globals/utils/authUtils";
import logger from "../../globals/utils/logger";
import notificationEventEmitter from "../notification/noti.event";
import { SendTokenNotificationI, VerifyAccountModel } from "./auth.model";

const authController = (function () {
  const createAccount = asyncHandler(async (req, res) => {
    // get the data from the request body
    let data = req.body as CreateUserModel;

    // check user existence from the db
    const found_user = await authService.getAccountByFilter({$or: [{ phone: data.phone },{ email: data.email }]}); 
    
    // return error response if existence is true
    if (found_user) {
      return res
        .status(404)
        .json({
          data: null,
          message: `User with email "${data.email}" or phone "${data.phone}" already exists`,
        } as ErrorResponse);
    }

    // hash the password
    const password_hash = await authenticationUtils.encryptPassword(data.password) as string;

    // add created at and updated at
    data.createdAt = new Date().toISOString();
    data.updatedAt = data.createdAt;
    data.password = password_hash;

    // add user to db
    const saved_account = await authService.saveAccount(data);

    if (!saved_account) {
        logger.error("[AuthController][createAccount] - Error while saving to Db:", saved_account);
        return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }

    // generate verification OTP - to be sent to user email
    const otp = await authenticationUtils.generateOTP() as string;

    // hash the generated OTP - to be saved in the Db
    const otp_hash = await authenticationUtils.encryptPassword(otp) as string;

    const saved_otp = await authService.saveAccountVerificationInfo({
        userId: saved_account._id,
        token: otp_hash,
        createdAt: new Date().toISOString(),
        expiresAt: Date.now() + 3600000
    }) as unknown as VerifyAccountModel;

    if (!saved_otp) {
        logger.error("[AuthController][saveAccountVerificationInfo] - Error while saving to Db:", saved_account);
        return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }

    // send user an email notification to verify account
    notificationEventEmitter.emit("send-otp-email", {
        emails: [data.email],
        token: otp,
        subject: "Verify Account"
    } as SendTokenNotificationI);

    // return the response
    return res.status(200).json({
      data: saved_otp,
      message: "Account created successfully!",
    } as ApiResponse<VerifyAccountModel>);
  });

  const emailLogin = asyncHandler((req, res) => {});

  const verifyAccount = asyncHandler((req, res) => {});

  const resetPassword = asyncHandler((req, res) => {});

  const forgetPassword = asyncHandler((req, res) => {});

  const updateAccount = asyncHandler((req, res) => {});

  const getCurrentUserProfile = asyncHandler((req, res) => {});

  return {
    createAccount,
    emailLogin,
    verifyAccount,
    resetPassword,
    forgetPassword,
    updateAccount,
    getCurrentUserProfile,
  };
})();

export default authController;
