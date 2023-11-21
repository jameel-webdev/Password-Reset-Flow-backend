import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { generateHashedPassword } from "../utils/generateHashedPassword.js";
import { generateToken } from "../utils/generateToken.js";

// REGISTER - USER
// route: POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // check the existing user
  if (email) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error(`User Already Exists`); // this all thrown errors handled by our custom errorMiddleware
    }
    // create user
    const hashedPassword = await generateHashedPassword(password);
    const user = await User.create({
      // for registering we can use create or save method
      name,
      email,
      password: hashedPassword,
    });
    // confirming the user created by sending data in json to view in postman
    if (user) {
      generateToken(res, user._id);
      res
        .status(201)
        .json({ _id: user._id, name: user.name, email: user.email });
    } else {
      res.status(400);
      throw new Error(`Invalid User Data`);
    }
  }
});

// LOGIN - AUTHENTICATION - SETTING TOKEN
// route: POST /api/users/login
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // finding the user with unique email
  const user = await User.findOne({ email });
  // after finding checking for the jwt token
  if (user) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error(`Invalid email or password`);
  }
});

// LOGOUT - USER
//route: POST /api/users/logout
export const logOutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Logout User" });
});

// GET USER PROFILE
//route: POST /api/users/profile
export const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get Profile" });
});

// UPDATE USER PROFILE
//route: PUT /api/users/profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "User profile updated" });
});

// FORGOT PASSWORD
//route: POST /api/users/forgotpassword
export const forgotPassword = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Email sent succesfully" });
});

// RESET PASSWORD
//route: PUT /api/users/resetpassword/:token
export const resetPassword = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Password reset successful" });
});
