import { COLLECTIONS } from "../../../config/db_config";
import DbConfig from "../../../database";
import logger from "../../../globals/utils/logger";
import { ReactionModel } from "./r.models";


const reactionService = (function() {

    const createReaction = async (data: ReactionModel) => {
        try {
            const database = DbConfig.getDb();
            if (!database) {
              return null;
            }
            const result = await database.collection(COLLECTIONS.REACTIONS).insertOne(data);
            return result;
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
            const quote = await database
              .collection(COLLECTIONS.REACTIONS)
              .findOne(filter);
            return quote;
          } catch (error) {
            logger.error(error as Error);
            return null;
          }
    }

    return {
        createReaction,
        getOneReactionByFilter
    }
})();

export default reactionService;