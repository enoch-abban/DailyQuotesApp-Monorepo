import { ErrorResponse } from "@dqa/shared-data";
import { COLLECTIONS } from "../../../config/db_config";
import DbConfig from "../../../database";
import logger from "../../../globals/utils/logger";
import { getFullReflectionAggregation, UpdateReflectionModel } from "./r.model";
import { ObjectId, PushOperator, WithId } from "mongodb";


const reflectionService = (function(){

    const saveReflection = async (quote_id: ObjectId, data: {}) => {
        try {
            const database = DbConfig.getDb();
            if (!database) {
              return null;
            }
            const result = await database.collection(COLLECTIONS.REFLECTIONS).insertOne(data);
            await database.collection(COLLECTIONS.QUOTES).updateOne({_id:quote_id}, {$push: {reflectionIds: result.insertedId} as PushOperator<Document>})
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
          .aggregate(getFullReflectionAggregation({ _id: id }))
          .toArray();
        
        if (quote.length > 0) {
          return quote[0];
        }
        return null;

      } catch (error) {
        const err = error as Error;
        logger.error(JSON.stringify({type: err.name, message:err.message, stack:err.stack}));
        return null;
      }  
    }

    const getReflectionByFilter = async (filter: {}) => {
        try {
            const database = DbConfig.getDb();
            if (!database) {
              return null;
            }
            const quote: WithId<UpdateReflectionModel> | null = await database
              .collection(COLLECTIONS.REFLECTIONS)
              .findOne(filter);
            return quote;
          } catch (error) {
            const err = error as Error;
            logger.error(JSON.stringify({type: err.name, message:err.message, stack:err.stack}));
            return null;
          }
    }

    const getReflectionByFilterAggregation = async (filter: {}) => {
      try {
        const database = DbConfig.getDb();
        if (!database) {
          return null;
        }
        const quote = await database
          .collection(COLLECTIONS.REFLECTIONS)
          .aggregate(getFullReflectionAggregation(filter))
          .toArray();
        return quote[0];
      } catch (error) {
        const err = error as Error;
        logger.error(JSON.stringify({type: err.name, message:err.message, stack:err.stack}));
        return null;
      }
    }

    return {
        saveReflection, 
        updateQuote,
        getReflectionByFilter,
        getReflectionByFilterAggregation
    }
})();

export default reflectionService;