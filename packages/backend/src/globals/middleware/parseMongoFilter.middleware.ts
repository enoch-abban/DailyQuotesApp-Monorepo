import filterHelper from "../utils/mongo.filter.helper";
import logger from "../utils/logger";
import { asyncHandler, isEmptyObject } from "../utils/asyncHandler";
import { ApiResponse } from "@dqa/shared-data";

export const parseMongoFilter = asyncHandler((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    // console.log("Before Parsing>>>>\n--------");
    // console.log("Query Filter:", req.query.filter);
    // console.log("Query Sort:", req.query.sort);
    // console.log("Query Limit:", req.query.limit, ", Type:", typeof req.query.limit);

    if (req.query.filter != null && req.query.filter != undefined) {
        try {
            const filter = JSON.parse(req.query.filter as string);
            if (typeof filter !== "object") {
                throw new Error(`Filter: ${filter} is not an object`);
            }
            req.query.filter = filterHelper.processQueryFilterToMongo(filter);
        } catch (error) {
            logger.error("[parseMongoFilter]", error);
            return res.status(400).json({
                data: null,
                message: `Filter ${req.query.filter} cannot be parsed☕!`
            } as ApiResponse<null>);
        }
    } else {req.query.filter = {}}

    if (req.query.sort != null && req.query.sort != undefined) {
        try {
            const sort = JSON.parse(req.query.sort as string);
            if (typeof sort !== "object") {
                throw new Error(`Sort: ${sort} is not an object`);
            }
            if (isEmptyObject(sort)) {
                throw new Error(`Sort: ${sort} cannot be an empty object`);
            }
            req.query.sort = sort;
        } catch (error) {
            logger.error("[parseMongoFilter]", error);
            return res.status(400).json({
                data: null,
                message: `Sort ${req.query.sort} cannot be parsed☕!`
            } as ApiResponse<null>);
        }
    } else {req.query.sort = JSON.parse('{ "updatedAt": -1 }');}

    req.query.limit = req.query.limit ?? "20";
    req.query.skip = req.query.skip ?? "0";

    console.log("After Parsing>>>>\n--------");
    console.log("Query Filter:", req.query.filter);
    console.log("Query Sort:", req.query.sort);
    console.log("Query Limit:", req.query.limit, ", Type:", typeof req.query.limit);
    console.log("Query Skip:", req.query.skip, ", Type:", typeof req.query.skip);

    next();
})