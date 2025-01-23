import { ObjectId } from "mongodb";
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
            const reaction = await database
              .collection(COLLECTIONS.REACTIONS)
              .findOne(filter);
            return reaction;
          } catch (error) {
            logger.error(error as Error);
            return null;
          }
    }

    const updateReaction = async (id: string, data: {}) => {
      try {
        const database = DbConfig.getDb();
        if (!database) {
          return null;
        }
        const reaction = await database.collection(COLLECTIONS.REACTIONS).updateOne({ _id: new ObjectId(id) }, { $set: data });
        return reaction;
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