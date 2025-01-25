import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { sign as JWTSign } from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import {
  ApiError,
  BodyValidationError,
  LoggerApiError,
} from "../../error/error";
import { EMAIL, PASSWORD } from "../../validator/auth/constants";
import { dbClient } from "../../service/dbClient";
import { ACCESS_TOKEN, INVALID_CREDENTIALS, REFRESH_TOKEN } from "./constants";

export const LoginController: RequestHandler = async (req, res, next) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const { email, password } = req.body as {
    [EMAIL]: string;
    [PASSWORD]: string;
  };

  try {
    const user = await dbClient.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });
    if (!user) return next(new ApiError(400, INVALID_CREDENTIALS, true));

    const isValidPassword = compareSync(password, user.password);
    if (!isValidPassword)
      return next(new ApiError(400, INVALID_CREDENTIALS, true));

    const accessToken = JWTSign(user, process.env.JWT_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_LIFE!,
    });
    const refreshToken = JWTSign(user, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_LIFE!,
    });

    res.cookie(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      data: { [ACCESS_TOKEN]: accessToken },
    });
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
};
