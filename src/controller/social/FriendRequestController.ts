import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import {
  ApiError,
  BodyValidationError,
  LoggerApiError,
} from "../../error/error";
import { dbClient } from "../../service/dbClient";
import { ExpressUser } from "../../types/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ALREADY_FRIEND_ERROR, FRIEND_REQUEST_SENT } from "./constants";
import { FRIEND_ID } from "../../validator/social/constants";

export const AddFriendController: RequestHandler = async (req, res, next) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty())
    return next(new BodyValidationError(validatedRes.array()));

  const friendId = (req.body as { [FRIEND_ID]: string }).friendId;
  const userId = (req.user as ExpressUser).id;

  try {
    await dbClient.friendship.create({
      data: { userId, friendId },
      select: { id: true },
    });
    res.status(200).json({ data: FRIEND_REQUEST_SENT });
  } catch (err) {
    console.log(err);
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return next(new ApiError(409, ALREADY_FRIEND_ERROR, true));
    } else return next(new LoggerApiError(err, 500));
  }
};

export const PendingFriendRequestsController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = (req.user! as ExpressUser).id;
    const pendingRequests = await dbClient.friendship.findMany({
      where: { userId, isAccepted: false },
      select: {
        id: true,
        user: {
          select: { username: true, profile: { select: { picture: true } } },
        },
      },
    });
    const flattenPendingRequests = pendingRequests.map((preq) => {
      return {
        username: preq.user.username,
        imageUrl: preq.user.profile!.picture!,
        id: preq.id,
      };
    });
    res.status(200).json({ data: flattenPendingRequests });
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
};

export const AcceptFriendRequestController: RequestHandler = async (
  req,
  res,
  next
) => {
  const validatedRes = validationResult(req);

  if (!validatedRes.isEmpty())
    return next(new BodyValidationError(validatedRes.array()));

  const userId = (req.user as ExpressUser).id;
  const { friendId, id } = req.body as { [FRIEND_ID]: string; id: string }; //id for row identification

  try {
    const updatedStatus = await dbClient.friendship.update({
      where: { id: id, userId, friendId },
      data: { isAccepted: true },
      select: { isAccepted: true },
    });
    res.status(200).json({ data: updatedStatus });
  } catch (err) {
    return next(new LoggerApiError(err, 500));
  }
};
