import express from "express";
import { connectDB } from "./dataBase/connection.js";
import { config } from "dotenv";

const app = express();
config();

app.use(express.json());

app.get("/", (res, req) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started at  port ${process.env.PORT}`);
  console.log("Press CTRL+C to Stop Server");
});
connectDB();
