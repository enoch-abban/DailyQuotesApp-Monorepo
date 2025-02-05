import { ObjectId, OptionalId, PushOperator } from "mongodb";
import { COLLECTIONS } from "../../../config/db_config";
import DbConfig from "../../../database";
import logger from "../../../globals/utils/logger";
import { ReactionModel } from "./r.models";
import { getFullQuoteAggregation, UpdateQuoteModel } from "../quotes/q.model";
import quoteService from "../quotes/q.service";


const reactionService = (function() {

    const createReaction = async (quote_id: ObjectId, reaction: ReactionModel) => {
        try {
            const database = DbConfig.getDb();
            if (!database) {
              return null;
            }

            await database
                    .collection(COLLECTIONS.QUOTES)
                    .updateOne({ _id: quote_id }, {$push: {reactions: reaction} as PushOperator<Document>});
            
            const quote_up = await database
              .collection(COLLECTIONS.QUOTES)
              .aggregate(getFullQuoteAggregation({ _id: quote_id }))
              .toArray();
            
            if (quote_up.length > 0) {
              return quote_up[0];
            }
            return null;

        } catch (error) {
            logger.error(error as Error);
            return null;
        } 
    }

    const getOneReactionByFilter = async (filter: {}) => {
        try {
            const database = DbConfig.getDb();
            if (!database) {
              return null;
            }
            const reaction = await database
              .collection(COLLECTIONS.REACTIONS)
              .findOne(filter);
            return reaction;
          } catch (error) {
            logger.error(error as Error);
            return null;
          }
    }

    const updateReaction = async (quote_id: ObjectId, reaction_id: ObjectId,data: {}) => {
      try {
        const database = DbConfig.getDb();
        if (!database) {
          return null;
        }
        await database
                    .collection(COLLECTIONS.QUOTES)
                    .updateOne({ _id: quote_id, "reactions._id": reaction_id }, {$set: {"reactions.$": data}});
            
            const quote_up = await database
              .collection(COLLECTIONS.QUOTES)
              .aggregate(getFullQuoteAggregation({ _id: quote_id }))
              .toArray();
            
            if (quote_up.length > 0) {
              return quote_up[0];
            }
            return null;

      } catch (error) {
        logger.error(error as Error);
        return null;
      }
    }

    return {
        createReaction,
        getOneReactionByFilter,
        updateReaction
    }
})();

export default reactionService;