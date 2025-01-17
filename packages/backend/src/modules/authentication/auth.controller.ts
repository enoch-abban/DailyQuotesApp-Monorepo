import { ApiResponse, ErrorResponse } from "@dqa/shared-data";
import { asyncHandler, to } from "../../globals/utils/asyncHandler";
import { CreateUserModel, UpdateUserModel } from "../user/u.model";
import authService from "./auth.service";
import authenticationUtils from "../../globals/utils/authUtils";
import logger from "../../globals/utils/logger";
import notificationEventEmitter from "../notification/noti.event";
import { SendTokenNotificationI, VerifyAccountModel } from "./auth.model";
import { ObjectId, WithId } from "mongodb";
import JWTUtils from "../../globals/utils/jwtUtils";

const authController = (function () {
  const processOTPGeneration = async (user_id: string, user_email: string) => {
    // generate verification OTP - to be sent to user email
    // const otp = (await authenticationUtils.generateOTP()) as string;

    const otp_gen = await to(authenticationUtils.generateOTP());
    if (otp_gen.error) {
      logger.error("[processOTPGeneration]", otp_gen.error);
      return false;
    }
    const otp = otp_gen.result as string;

    // hash the generated OTP - to be saved in the Db
    // const otp_hash = (await authenticationUtils.encryptPassword(otp)) as string;
    const pass_encrypt = await to(authenticationUtils.encryptPassword(otp));
    if (pass_encrypt.error) {
      logger.error("[processOTPGeneration]", pass_encrypt.error);
      return false;
    }

    const otp_hash = pass_encrypt.result as string;

    // TODO: Sign the OTP + userId as one token
    const saved_otp = (await authService.saveAccountVerificationInfo({
      userId: user_id,
      token: otp_hash,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 3600000,
    }));

    if (!saved_otp) {
      logger.error("[processOTPGeneration] - Error while saving OTP to Db!");
      return false;
    }

    // send user an email notification to verify account
    notificationEventEmitter.emit("send-otp-email", {
      emails: [user_email],
      token: otp,
      subject: "Verify Account",
    } as SendTokenNotificationI);

    return true;
  };

  const createAccount = asyncHandler(async (req, res) => {
    // get the data from the request body
    let data = req.body as CreateUserModel;

    // check user existence from the db
    const found_user = await authService.getAccountByFilter({
      $or: [{ phone: data.phone }, { email: data.email }],
    });

    // return error response if existence is true
    if (found_user) {
      return res.status(403).json({
        data: null,
        message: `User with email "${data.email}" or phone "${data.phone}" already exists`,
      } as ErrorResponse);
    }

    // encrypt the password

    // const password_hash = (await authenticationUtils.encryptPassword(
    //   data.password
    // )) as string;

    const pass_encrypt = await to(
      authenticationUtils.encryptPassword(data.password)
    );
    if (pass_encrypt.error) {
      logger.error("[createAccount]", pass_encrypt.error);
      return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }
    const password_hash = pass_encrypt.result as string;

    // add created at and updated at
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    data.password = password_hash;
    data.verified = false;

    // add user to db
    const saved_account = await authService.saveAccount(data);

    if (!saved_account) {
      logger.error("[createAccount]: Error while saving to Db!");
      return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }

    // generate verification OTP and send to user email
    const otp_success = await processOTPGeneration(
      saved_account.insertedId.toString(),
      data.email
    );
    if (!otp_success) {
      return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }

    // return the response
    return res.status(200).json({
      data: { userId: saved_account.insertedId.toString() },
      message: "Account created successfully! Verify your account with OTP sent via email🍻!",
    } as ApiResponse<{ userId: string }>);
  });

  const signin = asyncHandler(async (req, res) => {
    const data = req.body as { email: string; password: string };

    // find account in db
    const account = (await authService.getAccountByFilter({
      email: data.email,
    })) as WithId<CreateUserModel>;
    if (!account) {
      logger.info(`[signin] User with email "${data.email}" not found in DB`);
      return res.status(404).json({
        data: null,
        message: `User with email "${data.email}" not found`,
      } as ErrorResponse);
    }

    // check if verified
    if (!account.verified) {
      return res.status(400).json({
        data: null,
        message: `User with email "${data.email}" has not been verified. Please verify email and try logging in again`,
      } as ErrorResponse);
    }

    // check password
    const valid_password = await to(authenticationUtils.decryptpassword(
      account.password,
      data.password
    ));
    if(valid_password.error) {
        logger.error("[signIn]", valid_password.error);
      return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }
    if (!valid_password.result) {
      return res.status(400).json({
        data: null,
        message: "Password is invalid🌚",
      } as ErrorResponse);
    }

    // Generate JWT token
    const jwt_token = JWTUtils.createJWT({
      userId: account._id.toString(),
      role: account.role,
    });

    // return success response
    return res.status(200).json({
      data: jwt_token,
      message: "Account logged in successfully!",
    } as ApiResponse<{ token: string }>);
  });

  const resendOTP = asyncHandler(async (req, res) => {
    const data = req.body as { userId: string };

    // check if userId is valid
    const account = (await authService.getAccountByFilter({
      _id: new ObjectId(data.userId),
    })) as WithId<CreateUserModel>;
    if (!account) {
      logger.info(`[resendOTP] User with _id: ${data.userId} not found in DB`);
      return res.status(404).json({
        data: null,
        message: "User doesn't exist☕!",
      } as ErrorResponse);
    }

    // check if verified
    if (account.verified) {
      return res.status(400).json({
        data: null,
        message: `User with email "${account.email}" has already been verified☕!`,
      } as ErrorResponse);
    }

    // process the OTP
    const otp_success = await processOTPGeneration(
      account._id.toString(),
      account.email
    );
    if (!otp_success) {
      return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }

    // return successful result
    return res.status(200).json({
      data: { userId: account._id.toString() },
      message:
        "OTP has been sent to your email! Get the code (from your inbox or spam) and enter it in the verification page🍻!",
    } as ApiResponse<{ userId: string }>);
  });

  const verifyAccount = asyncHandler(async (req, res) => {
    const data = req.body as { userId: string; token: string };

    // check if userId is valid
    const account = await authService.getAccountByFilter(
        {_id: new ObjectId(data.userId)}
    ) as WithId<CreateUserModel> | null;
    if (!account) {
      logger.info(
        `[VerifyAccount] User with _id: ${data.userId} not found in DB`
      );
      return res.status(404).json({
        data: null,
        message: "User doesn't exist",
      } as ErrorResponse);
    }

    if (account.verified) {
      logger.info(
        `[VerifyAccount] User with _id: ${data.userId} attempted to re-verify`
      );
      return res.status(403).json({
        data: null,
        message:
          "This account has already been verified. Just sign in, cheers🍻",
      } as ErrorResponse);
    }

    // get the most recent verification otp from DB
    const veri_info = (await authService.getAccountVerificationInfoByFilter({
      userId: data.userId,
    })) as VerifyAccountModel;
    if (!veri_info) {
      return res.status(404).json({
        data: null,
        message: "User hasn't signed up",
      } as ErrorResponse);
    }

    // check token's expiry
    if (veri_info.expiresAt < Date.now()) {
      return res.status(400).json({
        data: null,
        message: "OTP has already expired. Request another one",
      } as ErrorResponse);
    }

    // compare otp hashes
    const otp_valid = await to(authenticationUtils.decryptpassword(
      veri_info.token,
      data.token
    ));
    if(otp_valid.error) {
        logger.error("[verifyAccount]", otp_valid.error);
      return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }
    if (!otp_valid.result) {
      return res.status(400).json({
        data: null,
        message: "OTP is invalid. Check your email and try again☕",
      } as ErrorResponse);
    }

    // Update the Account details
    const update_info = {
      verified: true,
      updatedAt: new Date().toISOString(),
    };
    const updated_account = (await authService.updateAccount(
      data.userId,
      update_info
    )) as WithId<UpdateUserModel>;
    if (!updated_account) {
      logger.error("[verifyAccount] - Error while saving to Db:", {
        _id: data.userId,
      });
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

  const resetPassword = asyncHandler(async (req, res) => {
    const data = req.body as { userId: string; password: string };

    // retrieve user account
    const account = (await authService.getAccountByFilter({
      _id: new ObjectId(data.userId),
    })) as WithId<CreateUserModel>;
    if (!account) {
      logger.info(
        `[resetPassword]: Unexpected error while retrieving user with _id: ${data.userId} from DB`
      );
      return res.status(503).json({
        data: null,
        message: "Something unexpected happened. Try again in a while ☕",
      } as ErrorResponse);
    }

    // encrypt user password
    const pass_encrypt = await to(
      authenticationUtils.encryptPassword(data.password)
    );
    if (pass_encrypt.error) {
      logger.error("[resetPassword]", pass_encrypt.error);
      return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while ☕",
        } as ErrorResponse);
    }
    const password_hash = pass_encrypt.result as string;

    const updated_account = (await authService.updateAccount(
        data.userId,
        { password: password_hash })) as WithId<UpdateUserModel> | null;
    
    if (!updated_account) {
      logger.error(
        "[forgetPassword] - Error while saving user to Db!", 
        { _id: data.userId}
      );
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
        message: "Account password reset successfully! Please sign in with new password🍻!",
      } as ApiResponse<WithId<UpdateUserModel>>);
    
  });

  const forgetPassword = asyncHandler(async (req, res) => {
    const data = req.body as { email: string };

    // check user existence from the db
    const found_user = (await authService.getAccountByFilter({
      email: data.email,
    })) as WithId<CreateUserModel> | null;
    if (!found_user) {
      return res.status(400).json({
        data: null,
        message: `User with email "${data.email}" doesn't exist. Kindly Sign Up🍻!`,
      } as ErrorResponse);
    }
    // reset user verified status
    if (found_user.verified) {
      const update_info = {
        verified: false,
        updatedAt: new Date().toISOString(),
      };
      const updated_account = (await authService.updateAccount(
        found_user._id.toString(),
        update_info
      )) as WithId<UpdateUserModel>;
      if (!updated_account) {
        logger.error("[forgetPassword] - Error while saving to Db!", {
          _id: found_user._id.toString(),
        });
        return res
          .status(503) //service unavailable
          .json({
            data: null,
            message: "Something unexpected happened. Try again in a while ☕",
          } as ErrorResponse);
      }
    }

    // generate otp and sent to user email
    const otp_success = await processOTPGeneration(
      found_user._id.toString(),
      found_user.email
    );
    if (!otp_success) {
      return res
        .status(503) //service unavailable
        .json({
          data: null,
          message: "Something unexpected happened. Try again in a while☕",
        } as ErrorResponse);
    }

    // return successful result
    return res.status(200).json({
      data: { userId: found_user._id.toString() },
      message:
        "An OTP has been sent to your email! Verify yourself with it to be able to reset your password 🍻",
    } as ApiResponse<{ userId: string }>);
  });

  const updateAccount = asyncHandler(async (req, res) => {
    const { userId } = req.app.locals.jwt;
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        data: null,
        message: "Data shouldn't be empty🥱",
      } as ErrorResponse);
    }

    const account = await authService.getAccountByFilter({
      _id: new ObjectId(userId as string),
    });
    if (!account) {
      return res.status(503).json({
        data: null,
        message: "Oops.. Something unexpected happened. Try again later☕!",
      } as ErrorResponse);
    }

    const updated_account = await authService.updateAccount(userId, data);
    if (!updated_account) {
      return res.status(503).json({
        data: null,
        message: "Oops.. Something unexpected happened. Try again later☕!",
      } as ErrorResponse);
    }

    return res.status(200).json({
      data: updated_account,
      message: "Account updated successfully🎉!",
    } as ApiResponse<WithId<UpdateUserModel>>);
  });

  const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.app.locals.jwt;

    const account = await authService.getAccountByFilterAggregation({
      _id: new ObjectId(userId as string),
    });
    if (!account) {
      return res.status(404).json({
        data: null,
        message: "Account not found☕!",
      } as ErrorResponse);
    }
    return res.status(200).json({
      data: account,
      message: "Account retrieved successfully!",
    } as ApiResponse<{}>);
  });

  //
  const getAllUserAccounts = asyncHandler(async(req, res) => {
    const { filter, sort, limit, skip } = req.query;

    const accounts = await authService.getAllAccounts(
      filter as {}, sort as {}, Number(limit), Number(skip)) as CreateUserModel[];

      return res.status(200).json({
        data: accounts,
        message: "Account retrieved successfully!",
      } as ApiResponse<CreateUserModel[]>);

  });

  return {
    createAccount,
    signin,
    verifyAccount,
    resendOTP,
    resetPassword,
    forgetPassword,
    updateAccount,
    getCurrentUserProfile,
    getAllUserAccounts
  };
})();

export default authController;
