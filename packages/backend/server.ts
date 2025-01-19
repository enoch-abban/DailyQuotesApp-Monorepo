import dotenv from "dotenv";
dotenv.config({
  path: "./.env.local"
})

import { createServer } from "node:http";
import { app } from "./src/app";
import DbConfig from "./src/database";
import { DB_NAME } from "./src/config/db_config";
import { ErrorResponse } from "@dqa/shared-data";
import logger from "./src/globals/utils/logger";


const port = process.env.PORT || 3001;

const httpServer = createServer(app);  // Done like this so I can easily integrate SocketIO

DbConfig.connectToDb(`${process.env.MONGOURL}/${DB_NAME}`).then(
  (client) => {
    app.locals.dbClient = client; // accessed via req.app.locals.dbClient

    //handle all undefined routes
    app.all('*', (req, res) => {
      const method = req.method;
      const route = req.originalUrl;
      res.status(404).json({ data:null, message: `Route ${method} ${route} not found` } as ErrorResponse);
    });

    // Start the server in listening mode
    httpServer.listen(port, () => {
      logger.info(`Example app listening at http://localhost:${port}`);
    });
  }
).catch((err) => {
  logger.error("MongoDB Error:", err);
  process.exit(1);
})


process.on('unhandledRejection', (reason, promise) => {

  logger.error("Unhandled Rejection @ DailyQuotes", reason);

});

process.stdin.resume(); // so the program will not close instantly

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error("Uncaught Exception @ DailyQuotes:", error);
});

process.on("beforeExit", async (code) => {
  if (app.locals.dbClient) {
    await app.locals.dbClient.close();
  }
  logger.error("Exiting process DQA with error code:", code);
});
