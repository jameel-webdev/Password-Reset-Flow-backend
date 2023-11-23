// PACKAGES
import express from "express";
import cors from "cors";
import { config } from "dotenv";
config({
  path: "./config/config.env", // instead of just config()-if path provided we dont need to stop and restart the server once any changes made in .env file
});
import userRouters from "./routes/userRouters.js";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const port = process.env.PORT || 5000;
// DATABASE
connectDb();

// EXPRESS INITIATED
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// ROUTES
app.use("/api/users", userRouters);

//CUSTOM MIDDLEWARE
app.use(errorHandler);

// LISTENING ON
app.get("/", (req, res) => {
  res.json({ message: `Welcome to Password Reset Flow Server Page` });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
