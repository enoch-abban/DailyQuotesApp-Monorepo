import { TypeOf } from "zod";
import { CreatedUpdatedAtType } from "../../../globals/global.types";
import quoteSchema from "./q.schema";


export type CreateQuoteModel = TypeOf<typeof quoteSchema.createQuote>["body"] & CreatedUpdatedAtType;
export type UpdateQuoteModel = TypeOf<typeof quoteSchema.updateQuote>["body"] & CreatedUpdatedAtType;