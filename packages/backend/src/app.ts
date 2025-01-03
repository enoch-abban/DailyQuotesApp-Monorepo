import express from "express";
import cors from "cors";
import morgan from "morgan";

import { QueryPayload } from "@dqa/shared-data";

import healthCheckRoute from "./modules/healthCheck/hc.routes";
import logger from "./globals/utils/logger";

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

app.use("/api/v1/healthcheck", healthCheckRoute);

app.get("/", (req, res) => {
  const responseData: QueryPayload = {
    payload: "Backend is online ☕",
  };

  res.json(responseData);
});
app.get("/data", (req, res) => {
  const responseData: QueryPayload = {
    payload: "Server returned data successfully!",
  };

  res.json(responseData);
});

export { app };
