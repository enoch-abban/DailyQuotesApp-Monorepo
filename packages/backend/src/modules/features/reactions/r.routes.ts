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

// Create a reaction for a quote
router.post("/quote", 
    validateToken,
    // validateSchema(reactionsSchema.getQuoteByIDSchema),
    validateSchema(reactionsSchema.createReaction),
    reactionsController.createReaction);

// Create a reaction for a reflection
router.post("/reflection", 
    validateToken,
    // validateSchema(reactionsSchema.getQuoteByIDSchema),
    validateSchema(reactionsSchema.createReflectionReaction),
    reactionsController.createReflectionReaction);

// Get all the reactions from a single quote
router.get("/quote/:quoteId", 
    validateToken,
    validateSchema(reactionsSchema.getQuoteByIDSchema),
    reactionsController.getQuoteReactions);

// Edit a quote's reaction by it's ID
router.patch("/quote/:id", 
    validateToken,
    // validateSchema(reactionsSchema.getQuoteByIDSchema),
    validateSchema(globalSchema.getByIdSchema),
    validateSchema(reactionsSchema.createReaction),
    reactionsController.updateReaction);

// Edit a reflection's reaction by it's ID
router.patch("/reflection/:id", 
    validateToken,
    // validateSchema(reactionsSchema.getQuoteByIDSchema),
    validateSchema(globalSchema.getByIdSchema),
    validateSchema(reactionsSchema.createReflectionReaction),
    reactionsController.updateReflectionReaction);

export default router;