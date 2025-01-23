import { TypeOf } from "zod"
import { CreatedUpdatedAtType } from "../../../globals/global.types"
import quoteSchema from "./q.schema"

export type CreateQuoteModel = TypeOf<typeof quoteSchema.createQuote>["body"] &
    CreatedUpdatedAtType
export type UpdateQuoteModel = TypeOf<typeof quoteSchema.updateQuote>["body"] &
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
            $lookup: {
                from: "Reactions",
                localField: "_id",
                foreignField: "quoteId",
                as: "reactionIds",
            },
        },
        {
            $lookup: {
                from: "Reflections",
                localField: "_id",
                foreignField: "quoteId",
                as: "reflectionIds",
            },
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true, // If no user is found, keep the field as null
            },
        },
        {
            $lookup: {
                from: "Users",
                let: { reactionUserIds: "$reactionIds.userId" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ["$_id", "$$reactionUserIds"] },
                        },
                    },
                    {
                        $project: {
                            email: 0,
                            gender: 0,
                            phone: 0,
                            createdAt: 0,
                            updatedAt: 0,
                        },
                    },
                ],
                as: "reactionUserDetails",
            },
        },
        {
            $lookup: {
                from: "Users",
                let: {
                    reflectionReactionUserIds:
                        "$reflectionIds.reactionIds.userId",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$_id", "$$reflectionReactionUserIds"],
                            },
                        },
                    },
                    {
                        $project: {
                            email: 0,
                            gender: 0,
                            phone: 0,
                            createdAt: 0,
                            updatedAt: 0,
                        },
                    },
                ],
                as: "reflectionReactionUserDetails",
            },
        },
        {
            $addFields: {
                reactionIds: {
                    $map: {
                        input: "$reactionIds",
                        as: "reaction",
                        in: {
                            $mergeObjects: [
                                "$$reaction",
                                {
                                    user: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$reactionUserDetails",
                                                    as: "reactionUser",
                                                    cond: {
                                                        $eq: [
                                                            "$$reactionUser._id",
                                                            "$$reaction.userId",
                                                        ],
                                                    },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
                reflectionIds: {
                    $map: {
                        input: "$reflectionIds",
                        as: "reflection",
                        in: {
                            $mergeObjects: [
                                "$$reflection",
                                {
                                    reactionIds: {
                                        $map: {
                                            input: "$$reflection.reactionIds",
                                            as: "reaction",
                                            in: {
                                                $mergeObjects: [
                                                    "$$reaction",
                                                    {
                                                        user: {
                                                            $arrayElemAt: [
                                                                {
                                                                    $filter: {
                                                                        input: "$reflectionReactionUserDetails",
                                                                        as: "reflectionReactionUser",
                                                                        cond: {
                                                                            $eq: [
                                                                                "$$reflectionReactionUser._id",
                                                                                "$$reaction.userId",
                                                                            ],
                                                                        },
                                                                    },
                                                                },
                                                                0,
                                                            ],
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
        {
            $project: {
                "user.email": 0,
                "user.gender": 0,
                "user.phone": 0,
                "user.createdAt": 0,
                "user.updatedAt": 0,
                reactionUserDetails: 0,
                reflectionReactionUserDetails: 0,
            },
        },
    ]
}
