import express from "express";
import { connectDB } from "./dataBase/connection.js";
import routes from "./routes/index.js";
import { config } from "dotenv";

const app = express();
config();
const PORT = process.env.PORT;

app.use(express.json());

app.use(routes);

app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    msg: err.msg,
  });
});

app.listen(PORT, () => {
  console.log(`Server started at  port ${PORT}`);
  console.log("Press CTRL+C to Stop Server");
});
connectDB();
