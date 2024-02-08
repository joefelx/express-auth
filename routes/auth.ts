import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

type StatusType =
  | "SIGNED_UP"
  | "LOGGED_IN"
  | "LOGGED_OUT"
  | "USER_EXISTS"
  | "USER_NOT_FOUND"
  | "FAILED"
  | "UNAUTHORISED"
  | "INVALID_PASSWORD"
  | "TOKEN_EXPIRED";

interface ResponseType {
  status: StatusType;
  message: String | JSON | null;
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const foundUser = await User.findOne({ email: email });

    if (foundUser) {
      const response: ResponseType = {
        status: "USER_EXISTS",
        message: "Go to Login",
      };

      return res.status(400).json(response);
    }

    // hashing the password
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // signing JWT token
    const token = jwt.sign({ name, email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // storing user in the database
    const user = new User({ name, email, password: hashedPassword, token });
    const saverUser = await user.save();

    const response: ResponseType = {
      status: "SIGNED_UP",
      message: saverUser.token,
    };

    res.status(201).json(response);
  } catch (error) {
    console.log(error);

    const response: ResponseType = {
      status: "FAILED",
      message: "Something went wrong!",
    };

    return res.status(500).json(response);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user && password) {
      await bcrypt.compare(password, String(user.password)).then(() => {
        const response: ResponseType = {
          status: "LOGGED_IN",
          message: user.token,
        };

        return res.status(200).json(response);
      });

      const response: ResponseType = {
        status: "INVALID_PASSWORD",
        message: "Provide a valid password",
      };

      return res.status(400).json(response);
    }

    const response: ResponseType = {
      status: "USER_NOT_FOUND",
      message: "Please Sign up a new user.",
    };

    return res.status(404).json(response);
  } catch (error) {
    console.log(error);

    const response: ResponseType = {
      status: "FAILED",
      message: "Something went wrong!",
    };

    return res.status(500).json(response);
  }
});

export default router;
