import express from "express";
import { connectDB } from "./dataBase/connection.js";
import routes from "./routes/index.js";
import { config } from "dotenv";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import cors from "cors";

const app = express();
config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("src/uploads"));

app.use(routes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
  console.log("Press CTRL+C to Stop Server");
});

connectDB();
