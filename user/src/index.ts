import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.route.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

dotenv.config();

connectDB();
connectRabbitMQ();
export const redisClient = createClient({
  url: process.env.REDIS_URL!,
});

redisClient
  .connect()
  .then(() => console.log("✅ Redis connected"))
  .catch((err) => console.log("❌ Redis connection error", err));

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
  res.send("User Server!");
});

app.listen(port, () => console.log(`🌐 Server running on port http://localhost:${port}`));
