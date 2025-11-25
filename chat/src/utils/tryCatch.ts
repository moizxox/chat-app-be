import type { NextFunction, Request, Response, RequestHandler } from "express";

const tryCatch =
  (handler: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong in tryCatch",
        error,
      });
    }
  };

export { tryCatch };
