import { NextFunction, Request, Response } from "express";
import ApiError from "../error/error";

type RequestHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export const errorMiddleware = () => {
  const middleware: RequestHandler = (error, req, res, next) => {
    res.status(error.status || 500).json({ error: error.message });
  };
  return middleware;
};
