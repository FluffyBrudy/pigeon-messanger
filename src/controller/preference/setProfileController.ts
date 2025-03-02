import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BodyValidationError, LoggerApiError } from "../../error/error";
import { createProfileSignature } from "../utils/signature";
import { ExpressUser } from "../../types/common";
import { dbClient } from "../../service/dbClient";

export const GetProfileSignatureController: RequestHandler = async (_, res) => {
  const signature = createProfileSignature();
  res.json({ data: signature });
};

export const SetInitProfileController: RequestHandler = async (
  req,
  res,
  next
) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const userId = (req.user as ExpressUser).id;
  const imageUrl = (req.body as { imageUrl: string }).imageUrl;

  try {
    await dbClient.profile.update({
      where: { userId: userId },
      data: { picture: imageUrl },
    });
    res.json({ data: { imageUrl } });
  } catch (error) {
    console.error((error as Error).message);
    return next(new LoggerApiError(error, 500));
  }
};
