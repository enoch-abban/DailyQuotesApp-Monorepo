import { ErrorResponse } from "@dqa/shared-data";
import { COLLECTIONS } from "../../../config/db_config";
import DbConfig from "../../../database";
import logger from "../../../globals/utils/logger";


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

    const updateQuote = async (data: {}) => {
        return null;
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
        return null;
    }

    return {
        saveQuote, 
        updateQuote,
        getQuoteByFilter,
        getQuoteByFilterAggregation
    }
})();

export default quoteService;