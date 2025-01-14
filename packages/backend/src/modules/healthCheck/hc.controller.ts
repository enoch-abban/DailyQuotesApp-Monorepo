import { ApiResponse } from "@dqa/shared-data";
import { asyncHandler } from "../../globals/utils/asyncHandler";
import { DB_NAME } from "../../config/db_config";
import { MongoClient } from "mongodb";
import notificationGateway from "../notification/noti.gateway";

const healthCheckController = (function () {
  const checkDatabase = asyncHandler(async (req, res) => {
    const client = req.app.locals.dbClient as MongoClient;
    await client.db(`${DB_NAME}`).command({ ping: 1 });
    return res
      .status(200)
      .json({
        data: "OK",
        message: "Database ping success!",
      } as ApiResponse<string>);
  });

  const checkGeneral = asyncHandler(async (req, res) => {
    const client = req.app.locals.dbClient as MongoClient;
    const pingRes = await client.db(`${DB_NAME}`).command({ ping: 1 });
    const mailVerified = await notificationGateway.verifySecureGmailTransporter() as Boolean;
    const dbOk = pingRes["ok"] == 1;
    return res
      .status(200)
      .json({
        data: { db: dbOk ? "passed" : "failed", mailer: mailVerified ? "passed" : "failed" },
        message: `General Health Check ${(dbOk && mailVerified) ? "passed" : "failed"}`,
      } as ApiResponse<{}>);
  });

  return {
    checkDatabase,
    checkGeneral,
  };
})();

export default healthCheckController;
