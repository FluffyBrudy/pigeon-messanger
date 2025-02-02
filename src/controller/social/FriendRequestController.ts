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
import { logger } from "../../logger/logger";

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

export const GetPendingRequestsController: RequestHandler = async (
  req,
  res,
  next
) => {
  const userId = (req.body as ExpressUser).id;
  try {
    const pendingRequests = await dbClient.friendship.findMany({
      where: { userId, isAccepted: false },
      select: {
        id: true,
        friend: {
          select: {
            username: true,
            id: true,
            profile: { select: { picture: true } },
          },
        },
      },
    });
    const flattenRequests = pendingRequests.map((pr) => ({
      friendshipId: pr.id,
      userId: pr.friend.id,
      username: pr.friend.username,
      imageUrl: pr.friend.profile!.picture,
    }));
    res.status(200).json({ data: flattenRequests });
  } catch (error) {
    logger.error(error);
    return next(new LoggerApiError(error, 500));
  }
};

export const GetAcceptedFriendRequestsController: RequestHandler = async (
  req,
  res,
  next
) => {
  const userId = (req.body as ExpressUser).id;
  try {
    const pendingRequests = await dbClient.friendship.findMany({
      where: { userId, isAccepted: true },
      select: {
        id: true,
        friend: {
          select: {
            username: true,
            id: true,
            profile: { select: { picture: true } },
          },
        },
      },
    });

    const flattenRequests = pendingRequests.map((pr) => ({
      friendshipId: pr.id,
      userId: pr.friend.id,
      username: pr.friend.username,
      imageUrl: pr.friend.profile!.picture,
    }));
    res.status(200).json({ data: flattenRequests });
  } catch (error) {
    logger.error(error);
    return next(new LoggerApiError(error, 500));
  }
};
