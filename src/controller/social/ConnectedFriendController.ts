import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BodyValidationError } from "../../error/error";
import { FRIEND_ID } from "../../validator/social/constants";
import { ExpressUser } from "../../types/common";

const UnfriendConnectedFriendController: RequestHandler = async (
  req,
  res,
  next
) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const friendId = req.body[FRIEND_ID] as string;
  const userId = (req.user as ExpressUser).id;
};
