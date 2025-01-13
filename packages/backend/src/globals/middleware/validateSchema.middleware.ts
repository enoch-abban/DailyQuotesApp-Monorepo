import { AnyZodObject, ZodError } from "zod";
import logger from "../utils/logger";
import { ApiResponse } from "@dqa/shared-data";
import { Request, Response, NextFunction } from "express";

export const validateSchema = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            params: req.params,
            body: req.body,
            query: req.query
        });
        next();
        
    } catch (error) {
        if (error instanceof ZodError) {
            logger.error(JSON.stringify({schemaVoilations: error.errors}));

            res.status(400).json({
                data: null,
                message: error.errors[0].message
            } as ApiResponse<null>)
        }
        next(error);
    }
  }
