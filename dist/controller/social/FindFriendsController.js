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
exports.FindFriendsController = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("../../error/error");
const dbClient_1 = require("../../service/dbClient");
const constants_1 = require("./constants");
const constants_2 = require("../../validator/social/constants");
const FindFriendsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRes = (0, express_validator_1.validationResult)(req);
    if (!validatedRes.isEmpty())
        return next(new error_1.BodyValidationError(validatedRes.array()));
    const userId = req.user.id;
    const cursorId = req.body[constants_2.CURSOR];
    const searchTerm = req.body[constants_2.SEARCH_TERM];
    const filter = req.body[constants_1.FILTER] || constants_1.UNKNOWN;
    const cursor = cursorId ? { cursor: { id: cursorId } } : {};
    try {
        switch (filter) {
            case constants_1.UNKNOWN:
                const friendSuggestionUnknown = yield dbClient_1.dbClient.user.findMany(Object.assign(Object.assign({}, cursor), { where: {
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
                    }, select: {
                        id: true,
                        username: true,
                        profile: { select: { picture: true } },
                    }, take: constants_1.FIND_FRIEND_COUNT, orderBy: { username: "asc" } }));
                const flattenFriendSuggestionUnknown = friendSuggestionUnknown.map((person) => {
                    var _a;
                    return ({
                        id: person.id,
                        username: person.username,
                        imageUrl: (_a = person.profile) === null || _a === void 0 ? void 0 : _a.picture,
                    });
                });
                res.status(200).json({ data: flattenFriendSuggestionUnknown });
                break;
            case constants_1.KNOWN:
                const acceptedFriends = yield dbClient_1.dbClient.user.findMany(Object.assign(Object.assign({}, cursor), { where: { id: userId }, select: {
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
                    }, take: constants_1.FIND_FRIEND_COUNT, orderBy: { username: "asc" } }));
                const flattenData = acceptedFriends.flatMap((item) => [
                    ...item.friendshipAsUser1.map(({ user2 }) => {
                        var _a;
                        return ({
                            id: user2.id,
                            username: user2.username,
                            picture: (_a = user2.profile) === null || _a === void 0 ? void 0 : _a.picture,
                        });
                    }),
                    ...item.friendshipAsUser2.map(({ user1 }) => {
                        var _a;
                        return ({
                            id: user1.id,
                            username: user1.username,
                            picture: (_a = user1.profile) === null || _a === void 0 ? void 0 : _a.picture,
                        });
                    }),
                ]);
                res.status(200).json({ data: flattenData });
                break;
            default:
                return next(new error_1.ApiError(400, "Bad filter", true));
        }
    }
    catch (err) {
        console.log(err);
        return next(new error_1.LoggerApiError(err, 500));
    }
});
exports.FindFriendsController = FindFriendsController;
