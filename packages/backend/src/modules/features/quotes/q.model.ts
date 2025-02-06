import { TypeOf } from "zod"
import { CreatedUpdatedAtType } from "../../../globals/global.types"
import quoteSchema from "./q.schema"
import { ReactionModel } from "../reactions/r.models"
import { ObjectId } from "mongodb"

export type CreateQuoteModel = TypeOf<typeof quoteSchema.createQuote>["body"] &
    CreatedUpdatedAtType
export type UpdateQuoteModel = TypeOf<typeof quoteSchema.updateQuote>["body"] & {userId:ObjectId, reflectionIds: ObjectId[], reactions: ReactionModel[]} &
    CreatedUpdatedAtType

export const getFullQuoteAggregation = (filter: {}) => {
    return [
        {
            $match: filter, // Match the specific quote by ID
        },
        {
            $lookup: {
                from: "Users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true, // If no user is found, keep the field as null
            },
        },
        {
            $project: {
                "user.email": 0,
                "user.gender": 0,
                "user.phone": 0,
                "user.createdAt": 0,
                "user.updatedAt": 0,
                "user.verified":0,
                "user.password":0,
                "user.role":0,
            },
        },
    ]
}
