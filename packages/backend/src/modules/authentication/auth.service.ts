import { ErrorResponse } from "@dqa/shared-data";
import { COLLECTIONS } from "../../config/db_config";
import DbConfig from "../../database";
import logger from "../../globals/utils/logger";
import { CreateUserModel, getUserAccountAggregation, UpdateUserModel } from "../user/u.model";
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

  const updateAccount = async (id: string, data: UpdateUserModel) => {
    try {
      const database = DbConfig.getDb();
      if (!database) {
        return null;
      }
      const obj_id = new ObjectId(id);
      await database
        .collection(COLLECTIONS.USERS)
        .updateOne({ _id: obj_id }, { $set: data });
      const account = await database
        .collection(COLLECTIONS.USERS)
        .findOne({ _id: obj_id });
      return account;
    } catch (error) {
      return null;
    }
  };

  const resetPassword = async (id: string, password: string) => {};

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
      logger.error(JSON.stringify(error as ErrorResponse));
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
      return null;
    }
  };

  const getAllAccountsByFilter = async (filter: {}) => {};

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
    const sort = { updatedAt: -1 }; //descending order (most recent first)
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
    
        console.log("[AuthService] VeriInfo:", veri_infos);

      return veri_infos[0].data[0];
    } catch (error) {
      return null;
    }
  };

  return {
    saveAccount,
    updateAccount,
    resetPassword,
    getAccountByFilter,
    getAllAccountsByFilter,
    saveAccountVerificationInfo,
    getAccountVerificationInfoByFilter,
    getAccountByFilterAggregation
  };
})();

export default authService;
