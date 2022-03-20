import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";

// const dbString =
//   "mongodb+srv://chie7tain:2A84scE0NCKxgVaK@cluster1.ku1s7.mongodb.net/lanisterpay?retryWrites=true&w=majority";
const DB = process.env.DATABASE_URL?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
) as string;

mongoose
  .connect(DB)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });

const port = process.env.PORT || 3000;
const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
