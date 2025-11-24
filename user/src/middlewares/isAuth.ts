import type { NextFunction, Request } from "express";
import type { IUser } from "../model/User.model.js";

export interface AuthenticatedReq extends Request {
  user?: IUser | null;
}

export const isAuth = (req:AuthenticatedReq, res:Response, next:NextFunction)=>{
    Promise<void>=>{
        
    }
}