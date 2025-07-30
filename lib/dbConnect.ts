import mongoose from "mongoose";

export const dbConnect = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to DB");
    return;
  }

  try {
       await mongoose.connect(process.env.MONGODB_URI!); // Changed from MONGO_URI to MONGODB_URI
    console.log("Connected to DB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
