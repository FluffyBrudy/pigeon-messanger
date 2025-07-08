import { RequestHandler } from "express";
import { ExpressUser } from "../../types/common";
import { dbClient } from "../../service/dbClient";
import { LoggerApiError } from "../../error/error";

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
      )
      SELECT "friendsOfFriend".*, "Profile"."username", "Profile"."picture"
      FROM "friendsOfFriend"
      INNER JOIN "Profile"
        ON "Profile"."userId" = "friendsOfFriend"."suggestedUser"
      ORDER BY "Profile"."username" ASC
      LIMIT ${LIMIT}::int
      OFFSET ${offset}::int
    `;
    res.status(200).json({ data: friendsOfFriend });
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
};
