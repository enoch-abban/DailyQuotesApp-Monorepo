import { ApiResponse } from "@dqa/shared-data";
import { asyncHandler } from "../../globals/utils/asyncHandler";
import { DB_NAME } from "../../config/db_config";
import { MongoClient } from "mongodb";

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
    const dbOk = pingRes["ok"] == 1;
    return res
      .status(200)
      .json({
        data: { db: pingRes },
        message: `General Health Check ${dbOk ? "passed!" : "failed!"}`,
      } as ApiResponse<{}>);
  });

  return {
    checkDatabase,
    checkGeneral,
  };
})();

export default healthCheckController;
