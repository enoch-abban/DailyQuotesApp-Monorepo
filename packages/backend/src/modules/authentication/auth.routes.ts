import { Router } from "express";
import authController from "./auth.controller";
import { validateSchema, validateToken } from "../../globals/middleware/validate.middleware";
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
    "/signin",
    validateSchema(authSchema.signInSchema),
    authController.signin);

router.get(
    "/account/profile",
    validateToken,
    authController.getCurrentUserProfile);



export default router;