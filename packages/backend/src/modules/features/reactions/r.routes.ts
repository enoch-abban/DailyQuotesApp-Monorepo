import { Router } from "express";
import reactionsController from "./r.controller";
import { validatePermission, validateSchema, validateToken } from "../../../globals/middleware/validate.middleware";
import reactionsSchema from "./r.schema";
import globalSchema from "../../../globals/global.schema";

const router = Router();

// Get all the reactions in the DB
router.get("/all", 
    validateToken,
    validatePermission(["admin"]),
    reactionsController.getAllReactions);

// Create a reaction for a given quote
router.post("/:quoteId", 
    validateToken,
    validateSchema(reactionsSchema.getQuoteByIDSchema),
    validateSchema(reactionsSchema.createReaction),
    reactionsController.createReaction);

// Get all the reactions from a single quote
router.get("/:quoteId", 
    validateToken,
    validateSchema(reactionsSchema.getQuoteByIDSchema),
    reactionsController.getQuoteReactions);

// Edit a reaction for a given quote
router.patch("/:quoteId/:id", 
    validateToken,
    validateSchema(reactionsSchema.getQuoteByIDSchema),
    validateSchema(globalSchema.getByIdSchema),
    validateSchema(reactionsSchema.createReaction),
    reactionsController.updateReaction);

export default router;