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
exports.SuggestNewFriendsController = void 0;
const dbClient_1 = require("../../service/dbClient");
const error_1 = require("../../error/error");
const SuggestNewFriendsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const friendsOfFriend = yield dbClient_1.dbClient.$queryRaw `
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
      AND f2."friendId" NOT IN (
        SELECT "friendId" 
        FROM "FriendshipRequest"
        WHERE "userId" = ${user.id}::uuid

        UNION
        
        SELECT "userId" 
        FROM "FriendshipRequest"
        WHERE "friendId" = ${user.id}::uuid
      )
    `;
        res.status(200).json({ data: friendsOfFriend });
    }
    catch (error) {
        return next(new error_1.LoggerApiError(error, 500));
    }
});
exports.SuggestNewFriendsController = SuggestNewFriendsController;
