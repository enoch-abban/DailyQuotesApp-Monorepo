import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

app.get("/", (req, res) => {
  res.json({ payload: "Server is online" });
});
app.get("/data", (req, res) => {
  res.json({ payload: "Server returned data successfully!" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
