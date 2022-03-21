import express, { Application, Request, Response } from "express";

import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import computeTransactionFee from "./controllers/compute-transaction-fee";
import createFeeSpec from "./controllers/fees";
const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.post("/fees", createFeeSpec);

app.post("/compute-transaction-fee", computeTransactionFee);
export default app;
