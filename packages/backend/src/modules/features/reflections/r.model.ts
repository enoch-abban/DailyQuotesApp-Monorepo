import { TypeOf } from "zod"
import { CreatedUpdatedAtType } from "../../../globals/global.types"
import reflectionSchema from "./r.schema"
import { ReactionModel } from "../reactions/r.models"
import { ObjectId } from "mongodb"
import { COLLECTIONS } from "../../../config/db_config"

export type CreateReflectionModel = TypeOf<
    typeof reflectionSchema.createReflection
>["body"] &
    CreatedUpdatedAtType
export type UpdateReflectionModel = TypeOf<
    typeof reflectionSchema.updateReflection
>["body"] & { reactions?: ReactionModel[], userId?: ObjectId } & CreatedUpdatedAtType

export const getFullReflectionAggregation = (filter:{}) => {
    return [
        {
          $match:
            /**
             * query: The query in MQL.
             */
            filter,
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
              from: COLLECTIONS.USERS,
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: "$user",
              preserveNullAndEmptyArrays: true,
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
              from: COLLECTIONS.QUOTES,
              localField: "quoteId",
              foreignField: "_id",
              pipeline: [
                {
                  $lookup: {
                    from: COLLECTIONS.USERS,
                    localField: "userId",
                    foreignField: "_id",
                    as: "quoteOwner"
                  }
                },
                {
                  $unwind: {
                    path: "$quoteOwner",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    "quoteOwner.email": 0,
                    "quoteOwner.gender": 0,
                    "quoteOwner.phone": 0,
                    "quoteOwner.createdAt": 0,
                    "quoteOwner.updatedAt": 0,
                    "quoteOwner.verified": 0,
                    "quoteOwner.password": 0,
                    "quoteOwner.role": 0,
                  }
                }
              ],
              as: "quote",
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: "$quote",
              preserveNullAndEmptyArrays: true,
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              "user.email": 0,
              "user.gender": 0,
              "user.phone": 0,
              "user.createdAt": 0,
              "user.updatedAt": 0,
              "user.verified": 0,
              "user.password": 0,
              "user.role": 0,
              "quote.reactions": 0,
              "quote.reflectionIds": 0,
              "quote.createdAt": 0,
              "quote.updatedAt": 0,
            },
        },
      ];
}
