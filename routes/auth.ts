import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/sigup", (req, res) => {
  const { name, email, password } = req.body;
});
