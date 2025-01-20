import { RequestHandler } from "express";
import passport, { authenticate } from "passport";
import { ExpressUser } from "../types/common";
import ApiError from "../error/error";

export const verifyAuth = () => {
  const middleware: RequestHandler = (req, res, next) => {
    return passport.authenticate(
      "jwt",
      { session: false },
      (
        err: ApiError,
        user: ExpressUser,
        info: { message: string; code: number }
      ) => {
        if (err) return next(err);
        if (!user) {
          return next(new ApiError(401, "User"));
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
  return middleware;
};
