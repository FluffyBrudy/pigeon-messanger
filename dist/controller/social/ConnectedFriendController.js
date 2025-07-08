"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipStatusController = exports.SuggestFriendsOfFriends = void 0;
const uuid_1 = require("uuid");
const dbClient_1 = require("../../service/dbClient");
const error_1 = require("../../error/error");
const LIMIT = 20;
const SuggestFriendsOfFriends = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const skip = parseInt(req.query.skip || "0");
    const offset = skip === 0 ? 0 : skip * LIMIT + 1;
    try {
        const friendsOfFriend = yield dbClient_1.dbClient.$queryRaw `
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
        res.status(200).json({ data: friendsOfFriend });
    }
    catch (error) {
        return next(new error_1.LoggerApiError(error, 500));
    }
});
exports.SuggestFriendsOfFriends = SuggestFriendsOfFriends;
const FriendshipStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const friendId = req.query.q;
    if (!friendId)
        return next(new error_1.ApiError(422, "invalid userId", true));
    if (friendId === userId)
        return next(new error_1.ApiError(422, "you cant check status with yourself"));
    try {
        if (!(0, uuid_1.validate)(friendId))
            return next(new error_1.ApiError(422, "invalid uuid format"));
        const isFriend = yield dbClient_1.dbClient.$queryRaw `
      SELECT 1 as "isFriend"
      FROM "BidirectionFriendship" bif
      WHERE bif."userId" = ${userId} AND bif."friendId" = ${friendId}
    `;
        res.status(200).json({ data: { isFriend: !!isFriend } });
    }
    catch (error) {
        return next(new error_1.LoggerApiError(error, 500, error.message, true));
    }
});
exports.FriendshipStatusController = FriendshipStatusController;
