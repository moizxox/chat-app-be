import { tryCatch } from "../utils/tryCatch.js";
import { redisClient } from "../index.js";
import { CustomError } from "../utils/customError.js";
import { publishToQueue } from "../config/rabbitmq.js";

export const loginUser = tryCatch(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new CustomError(400, "Email is required"));
  }

  const rateLimitKey = `rateLimit:otp:${email}`;
  const rateLimit = await redisClient.get(rateLimitKey);

  if (rateLimit) {
    return next(new CustomError(429, "Too many requests, wait before trying again"));
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, { EX: 300 });
  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  const message = { to: email, subject: "OTP", body: `Your OTP is ${otp}, valid for 5 minutes` };
  await publishToQueue("send-otp", message);
  console.log("OTP sent successfully to your email!", email);

  res.status(200).json({
    message: "OTP sent successfully to your email!",
  });
});
