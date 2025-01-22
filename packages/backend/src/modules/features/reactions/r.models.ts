// import { TypeOf } from "zod";
import { CreatedUpdatedAtType } from "../../../globals/global.types";
// import reactionsSchema from "./r.schema";
import { OptionalId, WithId } from "mongodb";


// export type CreateReactionModel = TypeOf<typeof reactionsSchema.createReaction>["body"] & CreatedUpdatedAtType;
// export type ReactionModel = {
//     _id?: string;
//     userId?: string;
//     quoteId?: string;
//     emoji?: string;
// } & CreatedUpdatedAtType

export type ReactionModel = OptionalId<{
    // _id?: string;
    userId?: string;
    quoteId?: string;
    emoji?: string;
} & CreatedUpdatedAtType>