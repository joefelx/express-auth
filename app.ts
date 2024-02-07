import dotenv from "dotenv";
dotenv.config();

import express, { application } from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import authRouter from "./routes/auth";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(morgan("tiny"));

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("MongoDB is connected!"));

app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});
app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server started at port:${PORT}`));
