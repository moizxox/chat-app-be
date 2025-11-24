import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../model/User.model.js";
import { CustomError } from "../utils/customError.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticatedReq extends Request {
  user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedReq, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) return next(new CustomError(401, "You are Unauthorized"));

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || !decoded.user) {
      console.log(decoded);
      return next(new CustomError(401, "Unauthorized or user not found"));
    }

    req.user = decoded.user;
    next();
  } catch (error) {
    return next(new CustomError(500, "Internal Server Error"));
  }
};
