import { Router } from "express";
import authController from "./auth.controller";
import { validateSchema } from "../../globals/middleware/validateSchema.middleware";
import userSchema from "../user/u.schema";



const router = Router();

router.post(
    "/signup", 
    validateSchema(userSchema.createUser),
    authController.createAccount);


export default router;