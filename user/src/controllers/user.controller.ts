import { tryCatch } from "../utils/tryCatch.js";
import { redisClient } from "../index.js";
import { CustomError } from "../utils/customError.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { User } from "../model/User.model.js";
import { generateTokens } from "../utils/generateTokens.js";
import type { AuthenticatedReq } from "../middlewares/isAuth.js";

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

export const verifyUser = tryCatch(async (req, res, next) => {
  const { email, otp: enteredOtp } = req.body;

  if (!email || !enteredOtp) {
    return next(new CustomError(400, "Email and OTP are required"));
  }

  const otpKey = `otp:${email}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp || storedOtp !== enteredOtp) {
    return next(new CustomError(400, "Invalid OTP or expired OTP"));
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });
  if (!user) {
    const name = email.split("@")[0];
    user = await User.create({ name, email });
    console.log("New User Created", user);
  }

  const { accessToken } = generateTokens(user);

  res.status(200).json({
    message: "User verified successfully!",
    accessToken,
  });
});

export const myProfile = tryCatch(async (req: AuthenticatedReq, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new CustomError(401, "Unauthorized"));
  }
  res.status(200).json({
    message: "User profile fetched successfully!",
    user,
  });
});
