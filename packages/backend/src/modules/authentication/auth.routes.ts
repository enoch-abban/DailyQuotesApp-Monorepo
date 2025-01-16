import { Router } from "express";
import authController from "./auth.controller";
import { validatePermission, validateSchema, validateToken } from "../../globals/middleware/validate.middleware";
import userSchema from "../user/u.schema";
import authSchema from "./auth.schema";



const router = Router();

router.post(
    "/signup", 
    validateSchema(userSchema.createUser),
    authController.createAccount);

router.post(
    "/verify",
    validateSchema(authSchema.verifyAccountSchema),
    authController.verifyAccount);

router.post(
    "/resendOTP",
    validateSchema(authSchema.resendOTPSchema),
    authController.resendOTP);

router.post(
    "/signin",
    validateSchema(authSchema.signInSchema),
    authController.signin);

router.post(
    "/forgetpassword",
    validateSchema(authSchema.forgetPasswordSchema),
    authController.forgetPassword);

router.post(
    "/resetpassword",
    validateSchema(authSchema.resetPasswordSchema),
    authController.resetPassword);

router.get(
    "/account/profile",
    validateToken,
    authController.getCurrentUserProfile);

router.patch(
    "/account/profile",
    validateSchema(userSchema.updateUser),
    validateToken,
    authController.updateAccount);

router.get(
    "/account/profile/all",
    validateToken,
    validatePermission(["admin"]),
    authController.getAllUserAccounts);


export default router;