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

type TCursor = { cursor: string } | {};
type Filter = typeof KNOWN | typeof UNKNOWN;

const FindFriendsController: RequestHandler = async (req, res, next) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty())
    return next(new BodyValidationError(validatedRes.array()));

  const cursorId = req.body[CURSOR];
  const searchTerm = req.body[SEARCH_TERM];
  const filter: Filter = req.body[FILTER] || UNKNOWN;
  const cursor: TCursor = cursorId ? { id: cursorId } : {};

  try {
    switch (filter) {
      case UNKNOWN:
        const friendSuggestionUnknown = await dbClient.user.findMany({
          ...cursor,
          where: {
            username: {
              startsWith: searchTerm,
              mode: "insensitive",
            },
            NOT: {
              FriendshipFriend: {
                some: {
                  friendId: (req.user as { id: string }).id,
                  isAccepted: true,
                },
              },
            },
          },
          select: {
            id: true,
            username: true,
            profile: { select: { picture: true } },
          },
          take: FIND_FRIEND_COUNT,
          orderBy: {
            created_at: "desc",
          },
        });
        console.log(friendSuggestionUnknown);
        const flattenFriendSuggestionUnknown = friendSuggestionUnknown.map(
          (person) => ({
            id: person.id,
            username: person.username,
            imageUrl: person.profile?.picture,
            isAccepted: false,
          })
        );
        res.status(200).json({ data: flattenFriendSuggestionUnknown });
        break;
      case KNOWN:
        const friendSuggestionKnown = await dbClient.friendship.findMany({
          where: {
            userId: (req.user as { id: string }).id,
            user: {
              username: {
                startsWith: searchTerm,
              },
            },
          },
          select: {
            user: {
              select: {
                id: true,
                username: true,
                profile: { select: { picture: true } },
              },
            },
          },
          take: FIND_FRIEND_COUNT,
          orderBy: {
            created_at: "desc",
          },
        });
        const flattenFriendSuggestionKnown = friendSuggestionKnown.map(
          (person) => ({
            id: person.user.id,
            username: person.user.username,
            imageUrl: person.user.profile?.picture,
            isAccepted: true,
          })
        );
        res.status(200).json({ data: flattenFriendSuggestionKnown });
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
