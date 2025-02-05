import { ObjectId, WithId } from "mongodb"
import { asyncHandler } from "../../../globals/utils/asyncHandler"
import quoteService from "../quotes/q.service"
import { UpdateQuoteModel } from "../quotes/q.model"
import { ApiResponse, ErrorResponse } from "@dqa/shared-data"
import { ReactionModel } from "./r.models"
import reactionService from "./r.service"
import logger from "../../../globals/utils/logger"
import authService from "../../authentication/auth.service"
import { UpdateUserModel } from "../../user/u.model"

const reactionsController = (function () {
    const createReaction = asyncHandler(async (req, res) => {
        const user_id = new ObjectId(req.app.locals.jwt.userId as string);
        const quote_id = new ObjectId(req.params.quoteId as string);
        const { emoji } = req.body

        const retrieved_quote = (await quoteService.getQuoteByFilter({
            _id: quote_id
        })) as WithId<UpdateQuoteModel> | null
        if (!retrieved_quote) {
            return res
                .status(404) //not found
                .json({
                    data: null,
                    message: `Quote with id "${req.params.quoteId}" not found☕!`,
                } as ErrorResponse);
        }
        const retrieved_reaction = retrieved_quote.reactions.find(reaction => {
            if (reaction.user?._id.equals(user_id)) {
                return reaction;
            }
            return null;
        });
        if (retrieved_reaction) {
            return res
                .status(400) //Bad request
                .json({
                    data: null,
                    message:
                        "Herh! You can't add more than one reaction to this quote ☕!",
                } as ErrorResponse);
        }
        const retrieved_user = await authService.getAccountByFilter({ _id: user_id }) as WithId<UpdateUserModel>;

        const reaction = {
            _id: new ObjectId(),
            emoji: emoji,
            quoteId: quote_id.toString(),
            user: {
                _id: user_id,
                name: `${retrieved_user.firstName} ${retrieved_user.middleName} ${retrieved_user.lastName}`,
                image: retrieved_user.image!,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        const saved_reaction = await reactionService.createReaction(quote_id,reaction);
        if (!saved_reaction) {
            logger.error("[createReaction]: Error while saving to Db!")
            return res
                .status(503) //service unavailable
                .json({
                    data: null,
                    message:
                        "Something unexpected happened. Try again in a while ☕",
                } as ErrorResponse)
        }

        // console.log("Retrieved Quote >>>", retrieved_quote);

        return res.status(200).json({
            data: saved_reaction,
            message: "Reaction created successfully!🍻!",
        } as ApiResponse<ReactionModel>)
    });

    //TODO: Fix duplicate reactions created via update
    const updateReaction = asyncHandler(async (req, res) => {
        const user_id = new ObjectId(req.app.locals.jwt.userId as string);
        const quote_id = new ObjectId(req.params.quoteId as string);
        const reaction_id = new ObjectId(req.params.id as string);
        const data = req.body;

        const retrieved_quote = (await quoteService.getQuoteByFilter({
            _id: quote_id, /**'reactions.user._id': user_id **/
        })) as WithId<UpdateQuoteModel> | null
        if (!retrieved_quote) {
            return res
                .status(404) //not found
                .json({
                    data: null,
                    message: `Quote with id "${quote_id}" not found☕!`,
                } as ErrorResponse);
        }
        let retrieved_result: {matchId:boolean;matchUser:boolean;reaction:ReactionModel|null} = { matchId: false, matchUser: false, reaction: null }
        retrieved_quote.reactions.find(reaction => {
            // console.log("Reaction >>> ", reaction);
            // console.log("Reaction.User === User >>> ", reaction.user?._id.equals(user_id));
            // console.log("Reaction.User >>> ", reaction.user?._id,"| User >>> ", user_id);
            if (reaction._id?.equals(reaction_id)) {
                retrieved_result.matchId = true;
                if (reaction.user?._id.equals(user_id)) {
                    retrieved_result.matchUser = true;
                    retrieved_result.reaction = reaction;
                }
            }
        });
        if (!retrieved_result.matchId) {
            return res
                .status(404) //Not Found
                .json({
                    data: null,
                    message:
                        `Reaction with id ${req.params.id} does not exist☕!`,
                } as ErrorResponse);
        }
        if (!retrieved_result.matchUser) {
            return res
                .status(401) //Unauthorized
                .json({
                    data: null,
                    message:
                        "Herh! You can't edit someone else's reaction☕!",
                } as ErrorResponse);
        }
        
        retrieved_result.reaction!.emoji = data.emoji;
        retrieved_result.reaction!.updatedAt = new Date().toISOString();

        const updated_quote = await reactionService.updateReaction(quote_id, reaction_id, retrieved_result.reaction!);
        if (!updated_quote) {
            logger.error("[updateReaction]: Error while saving to Db!")
            return res
                .status(503) //service unavailable
                .json({
                    data: null,
                    message:
                        "Something unexpected happened. Try again in a while ☕",
                } as ErrorResponse)
        }

        return res.status(200).json({
            data: retrieved_result.reaction!,
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