import { CreatedUpdatedAtType } from "../../../globals/global.types";
import { OptionalId, WithId } from "mongodb";


export type ReactionModel = OptionalId<{
    userId?: string;
    quoteId?: string;
    emoji?: string;
} & CreatedUpdatedAtType>