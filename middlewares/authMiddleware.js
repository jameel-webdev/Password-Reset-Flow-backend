import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  // initializing token
  let token;
  // getting token from cookies -- this can be done only bcoz of the cookieParser
  token = req.cookies.jwt;
  // check for token in frontend
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password"); //select is used simply we dont want to return the password from the user data
      next();
    } catch (error) {
      res.status(401);
      throw new Error(`Not Authorized , invalid token`);
    }
  } else {
    res.status(401);
    throw new Error(`Not Authorized , no token`);
  }
});
