import { ErrorResponse } from "@dqa/shared-data";
import { COLLECTIONS } from "../../config/db_config";
import DbConfig from "../../database";
import logger from "../../globals/utils/logger";
import { CreateUserModel, UpdateUserModel } from "../user/u.model";
import { VerifyAccountModel } from "./auth.model";
import { MongoError } from "mongodb";

const authService = (function () {
  const saveAccount = async (data: CreateUserModel) => {
    try {
      const database = DbConfig.getDb();
      if (!database) {
        return null;
      }
      const account = (await database
        .collection(COLLECTIONS.USERS)
        .insertOne(data)) as unknown as CreateUserModel & { _id: string };
      return account;
    } catch (error) {
      logger.error(JSON.stringify(error as ErrorResponse));
      return null;
    }
  };

  const updateAccount = async (id: string, data: UpdateUserModel) => {};

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

  return {
    saveAccount,
    updateAccount,
    resetPassword,
    getAccountByFilter,
    getAllAccountsByFilter,
    saveAccountVerificationInfo,
  };
})();

export default authService;
