import mongoose from "mongoose";
import { config } from "dotenv";
config({
  path: "./config.env", // instead of just config()-if path provided we dont need to stop and restart the server once any changes made in .env file
});
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb Connected Successfully");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;
