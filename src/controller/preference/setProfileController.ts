import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BodyValidationError } from "../../error/error";
import { createProfileSignature } from "../utils/signature";

export const GetProfileSignatureController: RequestHandler = async (
  req,
  res,
  next
) => {
  const signature = createProfileSignature();
  res.json({ data: signature });
};

export const setInitProfileController: RequestHandler = async (
  req,
  res,
  next
) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }
};
