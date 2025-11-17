import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { createClient } from "redis";

dotenv.config();

connectDB();

export const redisClient = createClient({
  url: process.env.REDIS_URL!,
});

redisClient
  .connect()
  .then(() => console.log("Redis connected"))
  .catch((err) => console.log(err));

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));
