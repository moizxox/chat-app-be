import type { NextFunction, Request, Response, RequestHandler } from "express";

const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong in asyncHandler",
        error,
      });
    }
  };

export { asyncHandler };
