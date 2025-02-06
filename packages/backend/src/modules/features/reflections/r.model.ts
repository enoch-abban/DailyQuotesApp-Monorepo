import { TypeOf } from "zod"
import { CreatedUpdatedAtType } from "../../../globals/global.types"
import reflectionSchema from "./r.schema"
import { ReactionModel } from "../reactions/r.models"
import { ObjectId } from "mongodb"

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
            $match : filter
        },
        {
            $limit: 1
        }
    ];
}
