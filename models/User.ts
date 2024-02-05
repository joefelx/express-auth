import mongoose from "mongoose";
import User from "../types/User";

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  token: {
    type: String,
    default: "",
  },
});

export default mongoose.model("User", userSchema);
