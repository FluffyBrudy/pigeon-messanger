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
import {
  ALREADY_REQUEST_SENT_ERROR,
  FRIEND_REQUEST_SENT,
  ALREADY_FRIEND_ERROR,
} from "./constants";
import { FRIEND_ID } from "../../validator/social/constants";
import { logger } from "../../logger/logger";
import { USERNAME } from "../../validator/auth/constants";

export const AddFriendController: RequestHandler = async (req, res, next) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty())
    return next(new BodyValidationError(validatedRes.array()));

  const friendId = (req.body as { [FRIEND_ID]: string }).friendId;
  const userId = (req.user as ExpressUser).id;
  const usersIds = [userId, friendId].sort();

  try {
    const alreadyFriended = await dbClient.acceptedFriendship.findUnique({
      where: {
        userId1_userId2: { userId1: usersIds[0], userId2: usersIds[1] },
      },
    });
    if (alreadyFriended) {
      return next(new ApiError(409, "You are already connected", true));
    }
    await dbClient.friendshipRequest.create({
      data: { userId, friendId },
      select: { userId: true },
    });
    res.status(200).json({ data: FRIEND_REQUEST_SENT });
  } catch (err) {
    const error = err instanceof PrismaClientKnownRequestError;
    if (error && err.code === "P2002") {
      return next(new ApiError(409, ALREADY_REQUEST_SENT_ERROR, true));
    } else if (error && err.code === "P2003") {
      return next(new ApiError(404, "User"));
    } else {
      return next(new LoggerApiError(err, 500));
    }
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
  const { friendId } = req.body as { [FRIEND_ID]: string; id: string };
  const usersIds = [userId, friendId].sort();
  try {
    await dbClient.$transaction([
      dbClient.friendshipRequest.deleteMany({
        where: {
          OR: [
            { userId, friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      }),
      dbClient.acceptedFriendship.create({
        data: { userId1: usersIds[0], userId2: usersIds[1] },
      }),
    ]);
    res.status(200).json({ data: true });
  } catch (err) {
    const error = err instanceof PrismaClientKnownRequestError;
    if (error && err.code === "P2002") {
      return next(new ApiError(409, ALREADY_FRIEND_ERROR, true));
    } else {
      return next(new LoggerApiError(err, 500));
    }
  }
};

export const RejectOrCancelFriendRequestController: RequestHandler = async (
  req,
  res,
  next
) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const userId = (req.user as ExpressUser).id;
  const { friendId } = req.body;

  try {
    await dbClient.$transaction([
      dbClient.friendshipRequest.deleteMany({
        where: {
          OR: [
            { userId, friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      }),
    ]);
    res.status(200).json({ data: true });
  } catch (err) {
    return next(new LoggerApiError(err, 500));
  }
};

export const GetPendingRequestsController: RequestHandler = async (
  req,
  res,
  next
) => {
  const userId = (req.user as ExpressUser).id;
  const isReqSent = req.query.type === "sent";

  const queryObj = isReqSent ? { userId: userId } : { friendId: userId };
  const userOrFriend = isReqSent ? "friend" : "user";

  try {
    const pendingRequests = await dbClient.friendshipRequest.findMany({
      where: { ...queryObj },
      select: {
        [userOrFriend]: {
          select: {
            username: true,
            id: true,
            profile: { select: { picture: true } },
          },
        },
      },
    });
    const flattenRequests = pendingRequests.map((pr) => ({
      userId: pr[userOrFriend]["id"],
      username: pr[userOrFriend][USERNAME],
      imageUrl: pr[userOrFriend]["profile"]["picture"],
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
  const userId = (req.user as ExpressUser).id;
  try {
    const friends: {
      id: string;
      username: string;
      picture: string;
    }[] = await dbClient.$queryRaw`
      SELECT 
        u.id, 
        u.username, 
        p."picture"
      FROM "AcceptedFriendship" af
      JOIN "User" u 
        ON u.id = (
          CASE 
            WHEN af."userId1" = ${userId}::UUID THEN af."userId2" 
            ELSE af."userId1" 
          END
        )
      LEFT JOIN "Profile" p 
        ON p."userId" = u.id
      WHERE af."userId1" = ${userId}::UUID 
        OR af."userId2" = ${userId}::UUID;
`;

    const modifiedData = friends.map(({ id, username, picture }) => ({
      userId: id,
      username,
      imageUrl: picture,
    }));
    res.status(200).json({ data: modifiedData });
  } catch (err) {
    return next(new LoggerApiError(err, 500));
  }
};
