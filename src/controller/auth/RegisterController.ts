import { RequestHandler } from "express";
import { hashSync, genSaltSync } from "bcryptjs";
import { validationResult } from "express-validator";
import { ApiError, BodyValidationError } from "../../error/error";
import { RegisterBody } from "../../types/common";
import { dbClient } from "../../service/dbClient";

export const RegisterController: RequestHandler = async (req, res, next) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const { username, email, password } = req.body as RegisterBody;
  const hashedPassword = hashSync(password, genSaltSync());
  try {
    await dbClient.$transaction(async () => {
      const user = await dbClient.user.create({
        data: { username, email, password: hashedPassword },
        select: { id: true },
      });
      await dbClient.profile.create({
        data: { user_id: user.id },
      });
    });
    res.status(200).json({ data: "user successfully created" });
  } catch (error: any) {
    if (error.code === "P2002")
      return next(new ApiError(409, "User already exists", true));
    else return next(new ApiError(500));
  }
};
