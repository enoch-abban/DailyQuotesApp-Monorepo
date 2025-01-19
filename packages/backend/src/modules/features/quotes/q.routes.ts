import { Router } from "express";
import quoteController from "./q.controller";
import { validatePermission, validateSchema, validateToken } from "../../../globals/middleware/validate.middleware";
import quoteSchema from "./q.schema";

const router = Router();

router.post("/", 
    validateToken,
    validateSchema(quoteSchema.createQuote),
    quoteController.createQuote);

router.patch("/:id", 
    validateToken,
    validateSchema(quoteSchema.updateQuote),
    quoteController.updateQuote);

router.get("/one/:id", 
    validateToken,
    quoteController.getUserQuote);

router.get("/all", 
    validateToken,
    quoteController.getUserQuotes);

router.get("/allusers", 
    validateToken,
    validatePermission(["admin"]),
    quoteController.getUserQuotes);



export default router;