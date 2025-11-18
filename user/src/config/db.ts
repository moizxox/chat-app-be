import mongoose from "mongoose";

const connectDB = async () => {
  const url = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME;

  if (!url || !dbName) {
    throw new Error("Please provide MONGO_URI or DB_NAME in the environment variables");
  }

  try {
    await mongoose.connect(url, {
      dbName,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
