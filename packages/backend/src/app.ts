import express from "express";
import cors from "cors";
import morgan from "morgan";

import { QueryPayload } from "@dqa/shared-data";
import logger from "./globals/utils/logger";
import { API_VERSION_ROUTE } from "./config/project.config";

// Routers Import
import healthCheckRoute from "./modules/healthCheck/hc.routes";
import authRoute from "./modules/authentication/auth.routes"
import { parseMongoFilter } from "./globals/middleware/parseMongoFilter.middleware";

const app = express();
const morganFormat = ":method :url :status :response-time ms";

app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const msg = message.split(" ");
        const logObject = {
          method: msg[0],
          url: msg[1],
          status: msg[2],
          responseTime: msg[3],
        };
        logger.info(JSON.stringify(logObject));
        // logger.info(message);
      },
    },
  })
);
app.use(parseMongoFilter);

app.use(`${API_VERSION_ROUTE}/healthcheck`, healthCheckRoute);
app.use(`${API_VERSION_ROUTE}/auth`, authRoute);

app.get("/", (req, res) => {
  const responseData: QueryPayload = {
    payload: "Backend is online ☕",
  };

  res.json(responseData);
});

export { app };
