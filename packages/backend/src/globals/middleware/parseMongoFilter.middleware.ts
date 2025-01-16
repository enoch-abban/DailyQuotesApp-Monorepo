import { NextFunction, Request, Response } from "express";
import filterHelper from "../utils/mongo.filter.helper";

export const parseMongoFilter = (req: Request, res: Response, next: NextFunction) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    if (req.query.filter != null && req.query.filter != undefined) {
        req.query.filter = filterHelper.processQueryFilterToMongo(JSON.parse(req.query.filter as string));
    }
    console.log("Query Filer:", req.query.filter);
    next();
}