import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      unique: true,
      validator: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be atleast 6 characters"],
      select: false, // don't show password in json
    },
    ResetPasswordToken: String,
    ResetPasswordExpires: String,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
