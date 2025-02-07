import { TypeOf } from "zod"
import { CreatedUpdatedAtType } from "../../../globals/global.types"
import quoteSchema from "./q.schema"
import { ReactionModel } from "../reactions/r.models"
import { ObjectId } from "mongodb"
import { COLLECTIONS } from "../../../config/db_config"

export type CreateQuoteModel = TypeOf<typeof quoteSchema.createQuote>["body"] &
    CreatedUpdatedAtType
export type UpdateQuoteModel = TypeOf<typeof quoteSchema.updateQuote>["body"] & {userId:ObjectId, reflectionIds: ObjectId[], reactions: ReactionModel[]} &
    CreatedUpdatedAtType

export const getFullQuoteAggregation = (filter: {}) => {
    return [
        {
          $match:
            /**
             * query: The query in MQL.
             */
            filter
        },
        {
          $lookup: {
            from: COLLECTIONS.USERS,
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
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: COLLECTIONS.REFLECTIONS,
              localField: "reflectionIds",
              foreignField: "_id",
              pipeline: [
                {
                  $lookup: {
                    from: COLLECTIONS.USERS,
                    localField: "userId",
                    foreignField: "_id",
                    as: "reflectionOwner",
                  },
                },
                {
                  $unwind: {
                    path: "$reflectionOwner",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    "reflectionOwner.email": 0,
                    "reflectionOwner.gender": 0,
                    "reflectionOwner.phone": 0,
                    "reflectionOwner.createdAt": 0,
                    "reflectionOwner.updatedAt": 0,
                    "reflectionOwner.verified": 0,
                    "reflectionOwner.password": 0,
                    "reflectionOwner.role": 0,
                  },
                },
              ],
              as: "reflections",
            },
        },
        {
          $project: {
            "user.email": 0,
            "user.gender": 0,
            "user.phone": 0,
            "user.createdAt": 0,
            "user.updatedAt": 0,
            "user.verified": 0,
            "user.password": 0,
            "user.role": 0,
          },
        },
      ]
}