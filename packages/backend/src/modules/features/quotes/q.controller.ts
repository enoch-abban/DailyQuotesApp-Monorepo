import { ApiResponse, ErrorResponse } from "@dqa/shared-data";
import { asyncHandler } from "../../../globals/utils/asyncHandler";
import quoteService from "./q.service";
import logger from "../../../globals/utils/logger";
import { UpdateQuoteModel } from "./q.model";


const quoteController = (function() {

    const createQuote = asyncHandler(async (req, res) => {
        const data = req.body;
        const { userId } = req.app.locals.jwt;

        // add necessary data
        data.userId = userId;
        data.reactionIds = [];
        data.reflectionIds = [];
        data.createdAt = new Date().toISOString();
        data.updatedAt = new Date().toISOString();

        const saved_quote = await quoteService.saveQuote(data);
        if (!saved_quote || !saved_quote.acknowledged) {
            logger.error("[createQuote]: Error while saving to Db!");
            return res
              .status(503) //service unavailable
              .json({
                data: null,
                message: "Something unexpected happened. Try again in a while ☕",
              } as ErrorResponse);
          }
        
        const retrieved_quote = await quoteService.getQuoteByFilter({ _id: saved_quote.insertedId });
        if (!retrieved_quote) {
            logger.error(`[createQuote]: Error while retrieving quote with id "${saved_quote.insertedId.toString()}" from Db!`);
            return res
              .status(503) //service unavailable
              .json({
                data: null,
                message: "Something unexpected happened. Try again in a while ☕",
              } as ErrorResponse);
        }

        return res.status(200).json({
            data: retrieved_quote,
            message: "Quote created successfully!🍻!",
          } as ApiResponse<UpdateQuoteModel>);
    });

    const updateQuote = asyncHandler(async (req, res) => {

        return res.status(200).json({
            data: {},
            message: "Quote updated successfully!🍻!",
          } as ApiResponse<{}>);
    });

    const getUserQuote = asyncHandler(async (req, res) => {
        
        return res.status(200).json({
            data: {},
            message: "Quote retrieved successfully!",
          } as ApiResponse<{}>);
    });

    const getUserQuotes = asyncHandler(async (req, res) => {

        return res.status(200).json({
            data: {},
            message: "User quotes retrieved successfully!",
          } as ApiResponse<{}>);
    });

    const getAllQuotes = asyncHandler(async (req, res) => {

        return res.status(200).json({
            data: {},
            message: "All quotes retrieved successfully!",
          } as ApiResponse<{}>);
    });

    return {
        createQuote,
        updateQuote,
        getUserQuote,
        getUserQuotes,
        getAllQuotes,
    }
})();

export default quoteController;