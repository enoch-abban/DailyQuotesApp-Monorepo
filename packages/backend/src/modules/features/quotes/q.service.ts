import { ErrorResponse } from "@dqa/shared-data";
import { COLLECTIONS } from "../../../config/db_config";
import DbConfig from "../../../database";
import logger from "../../../globals/utils/logger";
import { getFullQuoteAggregation } from "./q.model";
import { ObjectId } from "mongodb";


const quoteService = (function(){

    const saveQuote = async (data: {}) => {
        try {
            const database = DbConfig.getDb();
            if (!database) {
              return null;
            }
            const result = await database.collection(COLLECTIONS.QUOTES).insertOne(data);
            return result;
          } catch (error) {
            logger.error(error as ErrorResponse);
            return null;
          }
    }

    const updateQuote = async (id: ObjectId, data: {}) => {
      try {
        const database = DbConfig.getDb();
        if (!database) {
          return null;
        }
        await database
        .collection(COLLECTIONS.QUOTES)
        .updateOne({ _id: id }, { $set: data });

        const quote = await database
          .collection(COLLECTIONS.QUOTES)
          .aggregate(getFullQuoteAggregation({ _id: id }))
          .toArray();
        return quote[0];

      } catch (error) {
        const err = error as Error;
        logger.error(JSON.stringify({type: err.name, message:err.message, stack:err.stack}));
        return null;
      }  
    }

    const getQuoteByFilter = async (filter: {}) => {
        try {
            const database = DbConfig.getDb();
            if (!database) {
              return null;
            }
            const quote = await database
              .collection(COLLECTIONS.QUOTES)
              .findOne(filter);
            return quote;
          } catch (error) {
            logger.error(error as Error);
            return null;
          }
    }

    const getQuoteByFilterAggregation = async (filter: {}) => {
      try {
        const database = DbConfig.getDb();
        if (!database) {
          return null;
        }
        const quote = await database
          .collection(COLLECTIONS.QUOTES)
          .aggregate(getFullQuoteAggregation(filter))
          .toArray();
        return quote[0];
      } catch (error) {
        const err = error as Error;
        logger.error(JSON.stringify({type: err.name, message:err.message, stack:err.stack}));
        return null;
      }
    }

    return {
        saveQuote, 
        updateQuote,
        getQuoteByFilter,
        getQuoteByFilterAggregation
    }
})();

export default quoteService;