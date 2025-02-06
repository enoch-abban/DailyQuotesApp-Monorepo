import { ObjectId, OptionalId, PushOperator } from "mongodb"
import { COLLECTIONS } from "../../../config/db_config"
import DbConfig from "../../../database"
import logger from "../../../globals/utils/logger"
import { ReactionModel } from "./r.models"
import { getFullQuoteAggregation, UpdateQuoteModel } from "../quotes/q.model"
import quoteService from "../quotes/q.service"
import { getFullReflectionAggregation } from "../reflections/r.model"

const reactionService = (function () {
    const save = async (id: ObjectId, reaction: ReactionModel, aggregation: Function, collection_name: string) => {
        try {
            const database = DbConfig.getDb()
            if (!database) {
                return null
            }

            const res = await database
                .collection(collection_name)
                .updateOne(
                    { _id: id },
                    { $push: { reactions: reaction } as PushOperator<Document> }
                )

            // const doc_update = await database
            //     .collection(collection_name)
            //     .aggregate(aggregation({ _id: id }))
            //     .toArray();

            // if (doc_update.length > 0) {
            //     return doc_update[0]
            // }
            return res;
        } catch (error) {
            logger.error(error as Error)
            return null
        }
    }

    const update = async (collection_name: string, doc_id: ObjectId, reaction_id: ObjectId, data: {}, aggregation: Function) => {
        try {
            const database = DbConfig.getDb()
            if (!database) {
                return null
            }
            const res = await database
                .collection(collection_name)
                .updateOne(
                    { _id: doc_id, "reactions._id": reaction_id },
                    { $set: { "reactions.$": data } }
                );
            return res;
        } catch (error) {
            logger.error(error as Error)
            return null
        }
    }

    const createReaction = async (
        quote_id: ObjectId,
        reaction: ReactionModel
    ) => {
        const res = await save(quote_id, reaction, getFullQuoteAggregation, COLLECTIONS.QUOTES);
        return res;
    }

    const getOneReactionByFilter = async (filter: {}) => {
        try {
            const database = DbConfig.getDb()
            if (!database) {
                return null
            }
            const reaction = await database
                .collection(COLLECTIONS.REACTIONS)
                .findOne(filter)
            return reaction
        } catch (error) {
            logger.error(error as Error)
            return null
        }
    }

    const updateReaction = async (
        quote_id: ObjectId,
        reaction_id: ObjectId,
        data: {}
    ) => {
        const res = await update(COLLECTIONS.QUOTES, quote_id, reaction_id, data, getFullQuoteAggregation);
        return res;
    }

    const createReflectionReaction = async (
        reflection_id: ObjectId,
        reaction: ReactionModel
    ) => {
        const res = await save(reflection_id, reaction, getFullReflectionAggregation, COLLECTIONS.REFLECTIONS);
        return res;
    }

    const updateReflectionReaction = async (
        reflection_id: ObjectId,
        reaction_id: ObjectId,
        data: {}
    ) => {
        const res = await update(COLLECTIONS.REFLECTIONS, reflection_id, reaction_id, data, getFullReflectionAggregation);
        return res;
    }

    return {
        createReaction,
        getOneReactionByFilter,
        updateReaction,
        createReflectionReaction,
        updateReflectionReaction
    }
})()

export default reactionService
