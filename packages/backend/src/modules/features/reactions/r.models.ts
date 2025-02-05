import { CreatedUpdatedAtType } from "../../../globals/global.types";
import { ObjectId, OptionalId, WithId } from "mongodb";


export type ReactionModel = OptionalId<{
    emoji?: string;
    quoteId?: string;
    user?: {
        _id: ObjectId;
        name: string;
        image: string;
    };
} & CreatedUpdatedAtType>