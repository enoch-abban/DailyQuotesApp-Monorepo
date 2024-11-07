import express from 'express';
import cors from 'cors';

import { QueryPayload } from 'shared-data';

const app = express();
const port = 3001;

app.use(cors());

app.get("/", (req, res) => {
  const responseData: QueryPayload = {
    payload: "Server data returned successfully",
  };

  res.json(responseData);
});
app.get("/data", (req, res) => {
  const responseData: QueryPayload = {
    payload: "Server returned data successfully!",
  };

  res.json(responseData);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
