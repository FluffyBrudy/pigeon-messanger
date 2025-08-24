import { RequestHandler } from "express";
import { hashSync, genSaltSync } from "bcryptjs";
import { validationResult } from "express-validator";
import {
  ApiError,
  BodyValidationError,
  LoggerApiError,
} from "../../error/error";
import { RegisterBody } from "../../types/common";
import { dbClient } from "../../service/dbClient";
import { USER_SUCCESSFULLY_CREATED } from "./constants";

export const RegisterController: RequestHandler = async (req, res, next) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const { username, email, password, imageUrl } = req.body as RegisterBody;
  const picture = imageUrl
    ? { profile: { create: { picture: imageUrl, username } } }
    : {};
  const hashedPassword = hashSync(password, genSaltSync());
  try {
    await dbClient.$transaction(async () => {
      const user = await dbClient.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          ...picture,
        },
        select: { id: true },
      });
      await dbClient.profile.create({
        data: { userId: user.id, username: username },
      });
    });
    res.status(200).json({ data: USER_SUCCESSFULLY_CREATED });
  } catch (error: any) {
    if (error.code === "P2002")
      return next(new ApiError(409, "User already exists", true));
    else return next(new LoggerApiError(error, 500));
  }
};
