import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import {
  ApiError,
  BodyValidationError,
  LoggerApiError,
} from "../../error/error";
import { dbClient } from "../../service/dbClient";
import { FILTER, FIND_FRIEND_COUNT, KNOWN, UNKNOWN } from "./constants";
import { CURSOR, SEARCH_TERM } from "../../validator/social/constants";
import { ExpressUser, TCursor } from "../../types/common";

type Filter = typeof KNOWN | typeof UNKNOWN;

const FindFriendsController: RequestHandler = async (req, res, next) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty())
    return next(new BodyValidationError(validatedRes.array()));

  const userId = (req.user as ExpressUser).id;
  const cursorId = req.body[CURSOR];
  const searchTerm = req.body[SEARCH_TERM];
  const filter: Filter = req.body[FILTER] || UNKNOWN;
  const cursor: TCursor = cursorId ? { cursor: { id: cursorId } } : {};

  try {
    switch (filter) {
      case UNKNOWN:
        const friendSuggestionUnknown = await dbClient.user.findMany({
          ...cursor,
          skip: cursorId ? 1 : 0,
          where: {
            id: { not: userId },
            username: {
              startsWith: searchTerm,
              mode: "insensitive",
            },
            FriendshipFriend: {
              none: { userId },
            },
            friendshipAsUser1: {
              none: { userId2: userId },
            },
            friendshipAsUser2: {
              none: { userId1: userId },
            },
          },
          select: {
            id: true,
            username: true,
            profile: { select: { picture: true } },
          },
          take: FIND_FRIEND_COUNT,
          orderBy: { username: "asc" },
        });

        const flattenFriendSuggestionUnknown = friendSuggestionUnknown.map(
          (person) => ({
            id: person.id,
            username: person.username,
            imageUrl: person.profile?.picture,
          })
        );
        res.status(200).json({ data: flattenFriendSuggestionUnknown });
        break;
      case KNOWN:
        const acceptedFriends = await dbClient.user.findMany({
          ...cursor,
          where: { id: userId },
          select: {
            friendshipAsUser1: {
              select: {
                user2: {
                  select: {
                    id: true,
                    username: true,
                    profile: { select: { picture: true } },
                  },
                },
              },
            },
            friendshipAsUser2: {
              select: {
                user1: {
                  select: {
                    id: true,
                    username: true,
                    profile: { select: { picture: true } },
                  },
                },
              },
            },
          },
          take: FIND_FRIEND_COUNT,
          orderBy: { username: "asc" },
        });

        const flattenData = acceptedFriends.flatMap((item) => [
          ...item.friendshipAsUser1.map(({ user2 }) => ({
            id: user2.id,
            username: user2.username,
            picture: user2.profile?.picture,
          })),
          ...item.friendshipAsUser2.map(({ user1 }) => ({
            id: user1.id,
            username: user1.username,
            picture: user1.profile?.picture,
          })),
        ]);
        res.status(200).json({ data: flattenData });
        break;
      default:
        return next(new ApiError(400, "Bad filter", true));
    }
  } catch (err) {
    console.log(err);
    return next(new LoggerApiError(err, 500));
  }
};

export { FindFriendsController };
