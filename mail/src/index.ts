import express from "express";
import dotenv from "dotenv";
import { startSendOtpConsumer } from "./consumer.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Mail Server!");
});

startSendOtpConsumer();

app.listen(port, () => console.log(`🌐 Server running on port http://localhost:${port}`));
