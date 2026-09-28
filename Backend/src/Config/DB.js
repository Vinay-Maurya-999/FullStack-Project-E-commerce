import mongoose from "mongoose";
import config from "./configUrl.js";

const ConnectDB = async () => {
  try {
    await mongoose.connect(config.mongoose_url);
    console.log("MongoDB connect successfully...");
  } catch (error) {
    console.log("ERROR IS FROM DB -->", error);
  }
};

export default ConnectDB;
