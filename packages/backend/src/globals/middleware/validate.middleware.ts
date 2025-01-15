import { AnyZodObject, ZodError } from "zod";
import logger from "../utils/logger";
import { ApiResponse } from "@dqa/shared-data";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import JWTUtils from "../utils/jwtUtils";

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

  export const validateToken = asyncHandler(async (req, res, next) => {
    const auth_header = req.headers.authorization?.split(" ");
    if (auth_header === undefined) {
        return res.status(401).json({
            data: null,
            message: "No Token provided☕!"
        } as ApiResponse<null>);
    }
    if (!(auth_header![0].startsWith("Toke")) && !(auth_header![0].startsWith("Bear"))) {
        return res.status(401).json({
            data: null,
            message: "Invalid Token format☕!"
        } as ApiResponse<null>);
    }
    if (auth_header!.length === 1 || auth_header![1].length < 1) {
        return res.status(401).json({
            data: null,
            message: `Invalid Token format "${auth_header!}"`
        } as ApiResponse<null>);
    }

    JWTUtils.verifyJWT(auth_header![1]).then((decoded) => {
        // console.log("[Decoded JWT]", decoded);
        req.app.locals["jwt"] = decoded;
        next();
    }).catch((error) => {
        logger.error("[verifyJWT]", error);
        return res.status(401).json({
            data: null,
            message: "Invalid Token passed☕!"
        } as ApiResponse<null>);
    });
  });
