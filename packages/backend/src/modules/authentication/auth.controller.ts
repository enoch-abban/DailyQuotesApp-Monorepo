import { ApiResponse, ErrorResponse } from "@dqa/shared-data";
import { asyncHandler } from "../../globals/utils/asyncHandler";
import { CreateUserModel, UpdateUserModel } from "../user/u.model";
import authService from "./auth.service";
import authenticationUtils from "../../globals/utils/authUtils";
import logger from "../../globals/utils/logger";
import notificationEventEmitter from "../notification/noti.event";
import { SendTokenNotificationI, VerifyAccountModel } from "./auth.model";
import { ObjectId, WithId } from "mongodb";
import JWTUtils from "../../globals/utils/jwtUtils";

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
    data.verified = false;

    // add user to db
    const saved_account = await authService.saveAccount(data);

    if (!saved_account) {
        logger.error("[createAccount] - Error while saving to Db:", saved_account);
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

    // TODO: Sign the OTP + userId as one token
    const saved_otp = await authService.saveAccountVerificationInfo({
        userId: saved_account.insertedId.toString(),
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



  const signin = asyncHandler(async (req, res) => {
    const data  = req.body as { email:string, password:string };

    // find account in db
    const account = await authService.getAccountByFilter({email: data.email}) as WithId<CreateUserModel>;
    if (!account) {
        logger.info(`[signin] User with email "${data.email}" not found in DB`);
        return res
        .status(404)
        .json({
          data: null,
          message: `User with email "${data.email}" not found`,
        } as ErrorResponse);
    }
    
    // check if verified
    if (!account.verified) {
        return res
        .status(400)
        .json({
          data: null,
          message: `User with email "${data.email}" has not been verified. Please verify email and try logging in again`,
        } as ErrorResponse);
    }

    // check password
    const valid_password = authenticationUtils.decryptpassword(account.password, data.password);
    if (!valid_password) {
        return res
        .status(400)
        .json({
          data: null,
          message: "Password is invalid🌚",
        } as ErrorResponse);
    }

    // Generate JWT token
    const jwt_token = JWTUtils.createJWT({userId: account._id.toString(), role: account.role});

    // return success response
    return res.status(200).json({
        data: jwt_token,
        message: "Account logged in successfully!",
      } as ApiResponse<{token: string}>);

  });

  const verifyAccount = asyncHandler(async (req, res) => {
    const data = req.body as {userId: string, token: string};

    // check if userId is valid
    const account = await authService.getAccountByFilter({_id: new ObjectId(data.userId)});
    if (!account) {
        logger.info(`[VerifyAccount] User with _id: ${data.userId} not found in DB`);
        return res
        .status(404)
        .json({
          data: null,
          message: "User doesn't exist",
        } as ErrorResponse);
    }

    // get the most recent verification otp from DB
    const veri_info = await authService.getAccountVerificationInfoByFilter({userId: data.userId}) as VerifyAccountModel;
    if (!veri_info) {
        return res
        .status(404)
        .json({
          data: null,
          message: "User hasn't signed up",
        } as ErrorResponse);
    }

    // check token's expiry
    if (veri_info.expiresAt < Date.now()){
        return res
        .status(400)
        .json({
          data: null,
          message: "OTP has already expired. Request another one",
        } as ErrorResponse);
    }

    // compare otp hashes
    const otp_valid = authenticationUtils.decryptpassword(veri_info.token, data.token);
    if (!otp_valid) {
        return res
        .status(400)
        .json({
          data: null,
          message: "OTP is invalid. Check your email and try again☕",
        } as ErrorResponse);
    }

    // Update the Account details
    const update_info = {verified: true, updatedAt: new Date().toDateString() };
    const updated_account = await authService.updateAccount(data.userId, update_info) as WithId<UpdateUserModel>;
    if (!updated_account) {
        logger.error("[verifyAccount] - Error while saving to Db:", {_id: data.userId});
        return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }
    
    // return the success response
    return res.status(200).json({
        data: updated_account,
        message: "Account verified successfully!",
      } as ApiResponse<WithId<UpdateUserModel>>);

  });

  const resetPassword = asyncHandler((req, res) => {});

  const forgetPassword = asyncHandler((req, res) => {});

  const updateAccount = asyncHandler((req, res) => {});

  const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const {userId} = req.app.locals.jwt;

    const account = await authService.getAccountByFilterAggregation({_id: new ObjectId(userId as string)});
    if (!account) {
        return res
        .status(404)
        .json({
          data: null,
          message: "Account not found☕!",
        } as ErrorResponse);
    }
    return res.status(200).json({
        data: account,
        message: "Account verified successfully!",
      } as ApiResponse<{}>); 
  });

  return {
    createAccount,
    signin,
    verifyAccount,
    resetPassword,
    forgetPassword,
    updateAccount,
    getCurrentUserProfile,
  };
})();

export default authController;
