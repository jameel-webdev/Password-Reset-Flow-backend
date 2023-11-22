import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import {
  generateHashedPassword,
  validatingPassword,
} from "../utils/generateHashedPassword.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendEmail.js";

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
  const existingUser = await User.findOne({ email });
  // after finding compare password and send jwt token
  if (existingUser) {
    const isPasswordValid = await validatingPassword(
      password,
      existingUser.password
    );
    if (isPasswordValid) {
      generateToken(res, existingUser._id);
      res.status(200).json({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      });
    } else {
      res.status(401);
      throw new Error(`Invalid user details`);
    }
  } else {
    res.status(401);
    throw new Error(`Invalid email or password`);
  }
});

// LOGOUT - USER
//route: POST /api/users/logout
export const logOutUser = asyncHandler(async (req, res) => {
  // clearing the cookies for logging out user
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: `User Logged Out` });
});

// FORGOT PASSWORD
//route: POST /api/users/forgotpassword
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // checking user in database
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    const resetToken = crypto.randomBytes(25).toString("hex");
    //storing the token in database
    const userResetToken = await User.updateOne(
      {
        _id: checkUser._id,
      },
      { $set: { resetPasswordToken: resetToken } }
    );
    //send token via email
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const text = `Click on this link to reset your password, ${url} . if you have not requested then please ignore `;

    await sendMail(checkUser.email, "Reset Password", text);

    res.status(200).json({
      message: `Reset password link has been sent to your ${checkUser.email}`,
    });
  } else {
    res.status(401);
    throw new Error(`Invalid Credentials`);
  }
});

// RESET PASSWORD
//route: PUT /api/users/resetpassword/:token
export const resetPassword = asyncHandler(async (req, res) => {
  //getting token from params
  const { token } = req.body;
  // hashing the user password
  const hashedPassword = await generateHashedPassword(req.body.password);
  // finding & comparing the token string
  const user = await User.findOne({
    resetPasswordToken: token,
  });
  if (user) {
    user.password = hashedPassword;
    user.resetPasswordToken = "";
    await user.save();
    res.status(200).json({
      message: "Password Resetted Successfully",
    });
  } else {
    res.status(400);
    throw new Error(`Invaild token`);
  }
});
