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
                } as ErrorResponse);
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

        //update the quotes reaction field
        const q_data = {reactionIds: [...retrieved_quote.reactionIds as string[], saved_reaction.insertedId.toString()]}
        console.log("Q-DATA >>>", q_data)
        const updated_quote = await quoteService.updateQuote(quote_id, q_data);
        if (!updated_quote || !updated_quote.acknowledged) {
            logger.error("[createReaction]: Error while updating quote!")
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
            message: "Reaction created successfully!🍻!",
        } as ApiResponse<ReactionModel>)
    });

    const updateReaction = asyncHandler(async (req, res) => {
        const user_id = req.app.locals.jwt.userId as string;
        const quote_id = req.params.quoteId as string;
        const reaction_id = req.params.id as string;
        const data = req.body;

        const retrieved_quote = (await quoteService.getQuoteByFilter({
            _id: new ObjectId(quote_id),
        })) as WithId<UpdateQuoteModel> | null
        if (!retrieved_quote) {
            return res
                .status(404) //not found
                .json({
                    data: null,
                    message: `Quote with id "${quote_id}" not found☕!`,
                } as ErrorResponse);
        }

        const retrieved_reaction =
            (await reactionService.getOneReactionByFilter({
                _id: new ObjectId(reaction_id),
            })) as ReactionModel | null;
        if (!retrieved_reaction) {
            return res
                .status(404) //Not found
                .json({
                    data: null,
                    message:
                        `Reaction with id ${reaction_id} cannot be found☕!`,
                } as ErrorResponse);
        }

        if (user_id !== retrieved_reaction.userId) {
            return res
                .status(401) //Unauthorized
                .json({
                    data: null,
                    message:
                        "Herh! You can't edit someone else's reaction☕!",
                } as ErrorResponse);
        }


        data.updatedAt = new Date().toISOString();

        const updated_result = await reactionService.updateReaction(reaction_id, data);
        if (!updated_result) {
            logger.error(
                `[updateReaction]: Error while updating reaction with id "${reaction_id}" from Db!`
            )
            return res
                .status(404) //service unavailable
                .json({
                    data: null,
                    message:
                        `Reaction with id ${reaction_id} cannot be found ☕`,
                } as ErrorResponse);
        }

        const updated_reaction =
            (await reactionService.getOneReactionByFilter({
                _id: new ObjectId(reaction_id)
            })) as ReactionModel | null

        return res.status(200).json({
            data: updated_reaction,
            message: "Reaction updated successfully!",
        } as ApiResponse<ReactionModel>)
    })

    const getQuoteReactions = asyncHandler(async (req, res) => { 
        return res.status(200).json({
            data: null,
            message: "Not implemented yet☕!",
        } as ApiResponse<null>);
    });

    const getUserReactions = asyncHandler(async (req, res) => {
        return res.status(200).json({
            data: null,
            message: "Not implemented yet☕!",
        } as ApiResponse<null>);
    })

    const getAllReactions = asyncHandler(async (req, res) => {
        return res.status(200).json({
            data: null,
            message: "Not implemented yet☕!",
        } as ApiResponse<null>);
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

// Impartations are shortcuts in the spirit
// He said to his people occupy till I come
// Transgenerational blessings will not cease anymore
// No more will my servants die with the gifts
// Where are the christian business men who will disciple the other christian business men
// Through discipleship you shall overcome the challenges

// "data": {
//     "_id": "678fd65a0ac4d91f45cedf03",
//     "content": "Success isn't about perfection; it's about persistence. Keep moving forward, even when the path feels uncertain.✨",
//     "userId": "67878eedadbade3f3606887e",
//     "media": "",
//     "reactionIds": [
//         {
//             "_id": "67927bc3ec68777a9f1fe8c0",
//             "emoji": "😍",
//             "userId": "678a6ef903002b09d161e6a6",
//             "user": {
//                 "_id": "678a6ef903002b09d161e6a6",
//                 // "email": "abbanenock@yahoo.com",
//                 "firstName": "Jade",
//                 "lastName": "Wilderman",
//                 // "phone": "+233599699789",
//                 // "gender": "M",
//                 "image": "https://avatars.githubusercontent.com/u/76768866",
//                 "middleName": "",
//                 // "createdAt": "2025-01-15T10:33:17.579Z",
//                 // "updatedAt": "Wed Jan 15 2025"
//             },
//             "quoteId": "678fd65a0ac4d91f45cedf03",
//             "createdAt": "2025-01-23T17:26:27.988Z",
//             "updatedAt": "2025-01-23T17:26:27.988Z"
//         },
//     ],
//     "reflectionIds": [
//         {
//             "_id": "afsdfsfsssdfsfdsdfsfsfdsf",
//             "content": "A simple reflection on the quote",
//             "userId": "67878eedadbade3f3606887q",
//             "reactionIds": [
//                 {
//                     "_id": "67927bc3ec68777a9f1fe8c0",
//                     "emoji": "😍",
//                     "userId": "678a6ef903002b09d161e6a6",
//                     "user": {
//                         "_id": "678a6ef903002b09d161e6a6",
//                         // "email": "abbanenock@yahoo.com",
//                         "firstName": "Jade",
//                         "lastName": "Wilderman",
//                         // "phone": "+233599699789",
//                         // "gender": "M",
//                         "image": "https://avatars.githubusercontent.com/u/76768866",
//                         "middleName": "",
//                         // "createdAt": "2025-01-15T10:33:17.579Z",
//                         // "updatedAt": "Wed Jan 15 2025"
//                     },
//                     "quoteId": "678fd65a0ac4d91f45cedf03",
//                     "createdAt": "2025-01-23T17:26:27.988Z",
//                     "updatedAt": "2025-01-23T17:26:27.988Z"
//                 },
//             "createdAt": "2025-01-23T17:26:27.988Z",
//             "updatedAt": "2025-01-23T17:26:27.988Z"
//             ]
//         }
//     ],
//     "createdAt": "2025-01-21T17:16:10.991Z",
//     "updatedAt": "2025-01-21T17:16:10.991Z"
// }