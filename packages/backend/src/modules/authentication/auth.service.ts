import { ErrorResponse } from "@dqa/shared-data";
import { COLLECTIONS } from "../../config/db_config";
import DbConfig from "../../database";
import logger from "../../globals/utils/logger";
import { CreateUserModel, getAllUserAccountsAggregation, getUserAccountAggregation, UpdateUserModel } from "../user/u.model";
import { VerifyAccountModel } from "./auth.model";
import { genericAggregation } from "../../globals/global.types";
import { ObjectId } from "mongodb";

const authService = (function () {
  const saveAccount = async (data: CreateUserModel) => {
    try {
      const database = DbConfig.getDb();
      if (!database) {
        return null;
      }
      const res = await database.collection(COLLECTIONS.USERS).insertOne(data);
      return res;
    } catch (error) {
      logger.error(JSON.stringify(error as ErrorResponse));
      return null;
    }
  };

  const updateAccount = async (id: string, data: UpdateUserModel & {password?: string}) => {
    try {
      const database = DbConfig.getDb();
      if (!database) {
        return null;
      }
      const obj_id = new ObjectId(id);
      await database
        .collection(COLLECTIONS.USERS)
        .updateOne({ _id: obj_id }, { $set: data });

        const accounts = await database
        .collection(COLLECTIONS.USERS)
        .aggregate(getUserAccountAggregation({ _id: obj_id }))
        .toArray();

      if (accounts.length > 0) {
        return accounts[0];
      }
      return null;
    } catch (error) {
      logger.error(JSON.stringify(error as ErrorResponse));
      return null;
    }
  };

  const getAccountByFilter = async (filter: {}) => {
    try {
      const database = DbConfig.getDb();
      if (!database) {
        return null;
      }
      const account = await database
        .collection(COLLECTIONS.USERS)
        .findOne(filter);
      return account;
    } catch (error) {
      logger.error(JSON.stringify(error));
      return null;
    }
  };

  const getAccountByFilterAggregation = async (filter: {}) => {
    try {
      const database = DbConfig.getDb();
      if (!database) {
        return null;
      }
      const accounts = await database
        .collection(COLLECTIONS.USERS)
        .aggregate(getUserAccountAggregation(filter))
        .toArray();

      if (accounts.length > 0) {
        return accounts[0];
      }
      return null;
    } catch (error) {
      logger.error(JSON.stringify(error as ErrorResponse));
      return null;
    }
  };

  const saveAccountVerificationInfo = async (data: VerifyAccountModel) => {
    try {
      const database = DbConfig.getDb();
      if (!database) {
        return null;
      }
      const veriInfo = database
        .collection(COLLECTIONS.USER_OTP)
        .insertOne(data);
      return veriInfo;
    } catch (error) {
      logger.error(JSON.stringify(error as ErrorResponse));
      return null;
    }
  };

  const getAccountVerificationInfoByFilter = async (filter: {}) => {
    const sort = { createdAt: -1 }; //descending order (most recent first)
    const limit = 1;
    const skip = 0;

    try {
      const database = DbConfig.getDb();
      if (!database) {
        return null;
      }
      const veri_infos = await database
        .collection(COLLECTIONS.USER_OTP)
        .aggregate(genericAggregation(filter, sort, limit, skip))
        .toArray(); // in the form [ { data: [ [Object] ], totalCount: number } ]

      return veri_infos[0].data[0];
    } catch (error) {
      return null;
    }
  };

  const getAllAccounts = async (filter: {}, sort: {}, limit: number, skip: number) => {
    const database = DbConfig.getDb();
    if (!database) return null;

    const all_accounts = await database.collection(COLLECTIONS.USERS).aggregate(getAllUserAccountsAggregation(filter, sort, limit, skip)).toArray();

    return all_accounts[0].data;
  }

  return {
    saveAccount,
    updateAccount,
    getAccountByFilter,
    saveAccountVerificationInfo,
    getAccountVerificationInfoByFilter,
    getAccountByFilterAggregation,
    getAllAccounts
  };
})();

export default authService;
