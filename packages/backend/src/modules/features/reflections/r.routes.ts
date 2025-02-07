import { Router } from "express";
import reflectionController from "./r.controller";
import { validatePermission, validateSchema, validateToken } from "../../../globals/middleware/validate.middleware";
import reflectionSchema from "./r.schema";
import globalSchema from "../../../globals/global.schema";
import reactionsSchema from "../reactions/r.schema";

const router = Router();

router.post("/", 
    validateToken,
    validateSchema(reflectionSchema.createReflection),
    reflectionController.createReflection);

router.get("/all", 
    validateToken,
    reflectionController.getUserReflections);

router.get("/allusers", 
    validateToken,
    validatePermission(["admin"]),
    reflectionController.getUserReflections);

router.patch("/:id", 
    validateToken,
    validateSchema(globalSchema.getByIdSchema),
    validateSchema(reflectionSchema.updateReflection),
    reflectionController.updateReflection);

router.get("/:id", 
    validateToken,
    // validateSchema(reactionsSchema.getQuoteByIDSchema),
    validateSchema(globalSchema.getByIdSchema),
    reflectionController.getUserReflection);

export default router;