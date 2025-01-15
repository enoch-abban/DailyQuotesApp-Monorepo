import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const asyncHandler = (requestHandler: (arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, arg1: Response<any, Record<string, any>>, arg2: NextFunction) => any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch(
            (err) => next(err)
        );
    }
};

// credits to: https://stackoverflow.com/a/53689892
const to = async (promise: Promise<any>) => {
    return promise.then(data => {
        return {error: null, result: data};
    }).catch(err => {
        return {error: err, result: null};
    });
}

export {asyncHandler, to};