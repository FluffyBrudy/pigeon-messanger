import { RequestHandler } from "express";
import { validate } from "uuid";
import { ExpressUser } from "../../types/common";
import { dbClient } from "../../service/dbClient";
import { ApiError, LoggerApiError } from "../../error/error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type FriendOfFriendResponse = {
  suggestedUser: string;
  username: string;
  picture: string;
};

const LIMIT = 20;
export const SuggestFriendsOfFriends: RequestHandler = async (
  req,
  res,
  next
) => {
  const user = req.user as ExpressUser;
  const skip = parseInt((req.query.skip as string | undefined) || "0");
  const offset = skip === 0 ? 0 : skip * LIMIT + 1;

  try {
    const friendsOfFriend = await dbClient.$queryRaw<FriendOfFriendResponse[]>`
      WITH "friendsOfFriend" as (
        SELECT DISTINCT f2."friendId" AS "suggestedUser"
        FROM "BidirectionFriendship" f1
        JOIN "BidirectionFriendship" f2
          ON f1."friendId" = f2."userId"
        WHERE f1."userId" = ${user.id}::uuid
          AND f2."friendId" != ${user.id}::uuid
          AND f2."friendId" not in (
            select "friendId" from "BidirectionFriendship"
              where "userId"=${user.id}::uuid
          )
        AND f2."friendId" NOT IN (
          SELECT "friendId" 
          FROM "FriendshipRequest"
          WHERE "userId" = ${user.id}::uuid
          UNION
          SELECT "userId" 
          FROM "FriendshipRequest"
          WHERE "friendId" = ${user.id}::uuid
        )
      )
      SELECT "friendsOfFriend".*, "Profile"."username", "Profile"."picture"
      FROM "friendsOfFriend"
      INNER JOIN "Profile"
        ON "Profile"."userId" = "friendsOfFriend"."suggestedUser"
      ORDER BY "Profile"."username" ASC
      LIMIT ${LIMIT}::int
      OFFSET ${offset}::int
    `;
    console.log(friendsOfFriend);
    res.status(200).json({ data: friendsOfFriend });
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
};

export const FriendshipStatusController: RequestHandler = async (
  req,
  res,
  next
) => {
  const userId = (req.user as ExpressUser).id;
  const friendId = req.query.q as string | undefined;

  if (!friendId) return next(new ApiError(422, "invalid userId", true));
  if (friendId === userId)
    return next(new ApiError(422, "you cant check status with yourself"));

  try {
    if (!validate(friendId))
      return next(new ApiError(422, "invalid uuid format"));

    const isFriend = await dbClient.$queryRaw<[{ isFriend: boolean }]>`
      SELECT 1 as "isFriend"
      FROM "BidirectionFriendship" bif
      WHERE bif."userId" = ${userId}::uuid AND bif."friendId" = ${friendId}::uuid
    `;
    res.status(200).json({ data: { isFriend: isFriend.length > 0 } });
  } catch (error) {
    return next(new LoggerApiError(error, 500, (error as Error).message, true));
  }
};

/**
 * Returns random user suggestions that:
 * - are not the current user
 * - are not already friends with the current user
 * - do not have a pending friendship request in either direction with the current user
 *
 * Optional query params:
 * - limit: number (1..50), defaults to LIMIT (20)
 */
export const SuggestRandomNonFriends: RequestHandler = async (
  req,
  res,
  next
) => {
  const user = req.user as ExpressUser;

  const requestedLimit = parseInt(
    (req.query.limit as string | undefined) || `${LIMIT}`
  );
  const limit =
    Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, LIMIT)
      : LIMIT;

  try {
    const suggestions = await dbClient.$queryRaw<FriendOfFriendResponse[]>`
      SELECT p."userId" AS "suggestedUser", p."username", p."picture"
      FROM "Profile" p
      WHERE p."userId" != ${user.id}::uuid
        AND p."userId" NOT IN (
          SELECT "friendId" 
          FROM "BidirectionFriendship" 
          WHERE "userId" = ${user.id}::uuid
        )
        AND p."userId" NOT IN (
          SELECT "friendId" 
          FROM "FriendshipRequest"
          WHERE "userId" = ${user.id}::uuid
          UNION
          SELECT "userId"
          FROM "FriendshipRequest"
          WHERE "friendId" = ${user.id}::uuid
        )
      ORDER BY random()
      LIMIT ${limit}::int
    `;

    res.status(200).json({ data: suggestions });
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
};
