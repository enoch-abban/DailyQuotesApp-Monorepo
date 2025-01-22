import { ObjectId, WithId } from "mongodb"
import { asyncHandler } from "../../../globals/utils/asyncHandler"
import quoteService from "../quotes/q.service"
import { UpdateQuoteModel } from "../quotes/q.model"
import { ApiResponse, ErrorResponse } from "@dqa/shared-data"
import { ReactionModel } from "./r.models"
import reactionService from "./r.service"
import logger from "../../../globals/utils/logger"

const reactionsController = (function () {
    const createReaction = asyncHandler(async (req, res) => {
        const user_id = req.app.locals.jwt.userId as string
        const quote_id = new ObjectId(req.params.quoteId as string)
        const { emoji } = req.body

        const retrieved_quote = (await quoteService.getQuoteByFilter({
            _id: quote_id,
        })) as WithId<UpdateQuoteModel> | null
        if (!retrieved_quote) {
            return res
                .status(404) //not found
                .json({
                    data: null,
                    message: `Quote with id "${req.params.quoteId}" not found☕!`,
                } as ErrorResponse)
        }

        const reaction: ReactionModel = {
            emoji: emoji,
            userId: user_id,
            quoteId: quote_id.toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        const saved_reaction = await reactionService.createReaction(reaction)
        if (!saved_reaction || !saved_reaction.acknowledged) {
            logger.error("[createReaction]: Error while saving to Db!")
            return res
                .status(503) //service unavailable
                .json({
                    data: null,
                    message:
                        "Something unexpected happened. Try again in a while ☕",
                } as ErrorResponse)
        }

        const retrieved_reaction =
            (await reactionService.getOneReactionByFilter({
                _id: saved_reaction.insertedId,
            })) as ReactionModel | null
        if (!retrieved_reaction) {
            logger.error(
                `[createReaction]: Error while retrieving quote with id "${saved_reaction.insertedId.toString()}" from Db!`
            )
            return res
                .status(503) //service unavailable
                .json({
                    data: null,
                    message:
                        "Something unexpected happened. Try again in a while ☕",
                } as ErrorResponse)
        }

        return res.status(200).json({
            data: retrieved_reaction,
            message: "Quote created successfully!🍻!",
        } as ApiResponse<ReactionModel>)
    })

    const updateReaction = asyncHandler((req, res) => {
        return
    })

    const getQuoteReactions = asyncHandler((req, res) => {
        return
    })

    const getUserReactions = asyncHandler((req, res) => {
        return
    })

    const getAllReactions = asyncHandler((req, res) => {
        return
    })

    return {
        createReaction,
        updateReaction,
        getQuoteReactions,
        getUserReactions,
        getAllReactions,
    }
})()

export default reactionsController
