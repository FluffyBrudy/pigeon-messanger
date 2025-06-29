import { RequestHandler } from "express";
import { ExpressUser } from "../../types/common";
import { dbClient } from "../../service/dbClient";
import { LoggerApiError } from "../../error/error";

type FriendOfFriendResponse = {
  friendId: string;
  username: string;
  picture: string;
};

export const SuggestNewFriendsController: RequestHandler = async (
  req,
  res,
  next
) => {
  const user = req.user as ExpressUser;
  try {
    const friendsOfFriend = await dbClient.$queryRaw<FriendOfFriendResponse[]>`
      WITH "friendsOfFriend" as (
        SELECT DISTINCT f2."friendId" AS "friendOfFriend"
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
        ON "Profile"."userId" = "friendsOfFriend"."friendOfFriend";
    `;
    res.status(200).json({ data: friendsOfFriend });
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
};
