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
      SELECT DISTINCT f2."friendId" AS friend_of_friend
      FROM "BidirectionFriendship" f1
      JOIN "BidirectionFriendship" f2
        ON f1."friendId" = f2."userId"
      WHERE f1."userId" = ${user.id}::uuid
        AND f2."friendId" != ${user.id}::uuid
        AND f2."friendId" not in (
          select "friendId" from "BidirectionFriendship"
            where "userId"=${user.id}::uuid
        )
    `;
    res.status(200).json({ data: friendsOfFriend });
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
};
