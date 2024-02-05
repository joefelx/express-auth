import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("MongoDB is connected!"));

app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.listen(PORT, () => console.log(`Server started at port:${PORT}`));
