import { ApiResponse, ErrorResponse } from "@dqa/shared-data"
import { asyncHandler } from "../../../globals/utils/asyncHandler"
import reflectionService from "./r.service"
import logger from "../../../globals/utils/logger"
import { UpdateReflectionModel } from "./r.model"
import { ObjectId, WithId } from "mongodb"
import quoteService from "../quotes/q.service"

const reflectionController = (function () {
    const createReflection = asyncHandler(async (req, res) => {
        const data = req.body
        const { userId } = req.app.locals.jwt;
        const quote_id = new ObjectId(data.quoteId as string);

        // check for valid quoteId
        const retrieved_quote = (await quoteService.getQuoteByFilter({
            _id: quote_id
        }));
        if (!retrieved_quote) {
            return res
                .status(404) //not found
                .json({
                    data: null,
                    message: `Quote with id "${data.quoteId}" not found☕!`,
                } as ErrorResponse);
        }

        // add necessary data
        data.quoteId = quote_id;
        data.userId = new ObjectId(userId as string);
        data.reactions = [];
        data.reflectionIds = [];
        data.createdAt = new Date().toISOString();
        data.updatedAt = new Date().toISOString();

        // save reflection + update quote
        const saved_reflection = await reflectionService.saveReflection(quote_id,data)
        if (!saved_reflection || !saved_reflection.acknowledged) {
            logger.error("[createReflection]: Error while saving to Db!")
            return res
                .status(503) //service unavailable
                .json({
                    data: null,
                    message:
                        "Something unexpected happened. Try again in a while ☕",
                } as ErrorResponse);
        }

        const retrieved_reflection = await reflectionService.getReflectionByFilter({
            _id: saved_reflection.insertedId,
        })
        if (!retrieved_reflection) {
            logger.error(
                `[createReflection]: Error while retrieving reflection with id "${saved_reflection.insertedId.toString()}" from Db!`
            );
            return res
                .status(503) //service unavailable
                .json({
                    data: null,
                    message:
                        "Something unexpected happened. Try again in a while ☕",
                } as ErrorResponse);
        }

        return res.status(200).json({
            data: retrieved_reflection,
            message: "Quote created successfully!🍻!",
        } as unknown as ApiResponse<UpdateReflectionModel>)
    })

    const updateReflection = asyncHandler(async (req, res) => {
        const user_id = req.app.locals.jwt.userId as string
        const reflection_id = new ObjectId(req.params.id as string);
        const data = req.body;

        const retrieved_reflection = (await reflectionService.getReflectionByFilter({
            _id: reflection_id,
        }))
        if (!retrieved_reflection) {
            return res
                .status(404) //not found
                .json({
                    data: null,
                    message: `Reflection with id "${req.params.id}" not found☕!`,
                } as ErrorResponse)
        }
        // console.log("UserReflection >>>", retrieved_reflection);
        if (retrieved_reflection.userId?.toString() !== user_id) {
            return res
                .status(400) //bad request
                .json({
                    data: null,
                    message: `Merrhn😒, you do not own this reflection☕!`,
                } as ErrorResponse);
        }

        //update the reflection
        const updated_reflection = await reflectionService.updateReflection(reflection_id, data);
        if (!updated_reflection) {
            logger.error(
                `[updateReflection]: Error while updating reflection with id "${req.params.id}" to Db!`
            );
            return res
                .status(503) //service unavailable
                .json({
                    data: null,
                    message:
                        "Something unexpected happened. Try again in a while ☕",
                } as ErrorResponse);
        }

        return res.status(200).json({
            data: updated_reflection,
            message: "Reflection updated successfully!🍻!",
        } as ApiResponse<{}>)
    })

    const getUserReflection = asyncHandler(async (req, res) => {
        const user_id = req.app.locals.jwt.userId as string
        // const quote_id = new ObjectId(req.params.quoteId as string);
        const reflection_id = new ObjectId(req.params.id as string);

        const retrieved_reflection = (await reflectionService.getReflectionByFilterAggregation({
            _id: reflection_id,
        }))
        if (!retrieved_reflection) {
            return res
                .status(404) //not found
                .json({
                    data: null,
                    message: `Reflection with id "${req.params.id}" not found☕!`,
                } as ErrorResponse)
        }
        // console.log("UserReflection >>>", retrieved_reflection);
        if (retrieved_reflection.userId?.toString() !== user_id) {
            return res
                .status(400) //bad request
                .json({
                    data: null,
                    message: `Merrhn😒, you do not own this reflection☕!`,
                } as ErrorResponse);
        }

        return res.status(200).json({
            data: retrieved_reflection,
            message: "Quote retrieved successfully!",
        } as ApiResponse<WithId<UpdateReflectionModel>>)
    })

    const getUserReflections = asyncHandler(async (req, res) => {
        return res.status(200).json({
            data: {},
            message: "User reflections retrieved successfully!",
        } as ApiResponse<{}>)
    })

    const getAllReflection = asyncHandler(async (req, res) => {
        return res.status(200).json({
            data: {},
            message: "All reflections retrieved successfully!",
        } as ApiResponse<{}>)
    })

    return {
      createReflection,
      updateReflection,
      getUserReflection,
      getUserReflections,
      getAllReflection,
    }
})()

export default reflectionController
