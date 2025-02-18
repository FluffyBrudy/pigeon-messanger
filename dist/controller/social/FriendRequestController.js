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
exports.GetAcceptedFriendRequestsController = exports.GetPendingRequestsController = exports.RejectOrCancelFriendRequestController = exports.AcceptFriendRequestController = exports.AddFriendController = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("../../error/error");
const dbClient_1 = require("../../service/dbClient");
const library_1 = require("@prisma/client/runtime/library");
const constants_1 = require("./constants");
const constants_2 = require("../../validator/social/constants");
const logger_1 = require("../../logger/logger");
const constants_3 = require("../../validator/auth/constants");
const AddFriendController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRes = (0, express_validator_1.validationResult)(req);
    if (!validatedRes.isEmpty())
        return next(new error_1.BodyValidationError(validatedRes.array()));
    const friendId = req.body.friendId;
    const userId = req.user.id;
    try {
        const alreadyFriended = yield dbClient_1.dbClient.acceptedFriendship.findUnique({
            where: { userId1_userId2: { userId1: userId, userId2: friendId } },
        });
        if (alreadyFriended) {
            return next(new error_1.ApiError(409, "You are already connected", true));
        }
        yield dbClient_1.dbClient.friendshipRequest.create({
            data: { userId, friendId },
            select: { userId: true },
        });
        res.status(200).json({ data: constants_1.FRIEND_REQUEST_SENT });
    }
    catch (err) {
        const error = err instanceof library_1.PrismaClientKnownRequestError;
        if (error && err.code === "P2002") {
            return next(new error_1.ApiError(409, constants_1.ALREADY_REQUEST_SENT_ERROR, true));
        }
        else if (error && err.code === "P2003") {
            return next(new error_1.ApiError(404, "User"));
        }
        else {
            return next(new error_1.LoggerApiError(err, 500));
        }
    }
});
exports.AddFriendController = AddFriendController;
const AcceptFriendRequestController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRes = (0, express_validator_1.validationResult)(req);
    if (!validatedRes.isEmpty())
        return next(new error_1.BodyValidationError(validatedRes.array()));
    const userId = req.user.id;
    const { friendId } = req.body;
    const usersIds = [userId, friendId].sort();
    try {
        yield dbClient_1.dbClient.$transaction([
            dbClient_1.dbClient.friendshipRequest.deleteMany({
                where: {
                    OR: [
                        { userId, friendId },
                        { userId: friendId, friendId: userId },
                    ],
                },
            }),
            dbClient_1.dbClient.acceptedFriendship.create({
                data: { userId1: usersIds[0], userId2: usersIds[1] },
            }),
        ]);
        res.status(200).json({ data: true });
    }
    catch (err) {
        const error = err instanceof library_1.PrismaClientKnownRequestError;
        if (error && err.code === "P2002") {
            return next(new error_1.ApiError(409, constants_1.ALREADY_FRIEND_ERROR, true));
        }
        else {
            return next(new error_1.LoggerApiError(err, 500));
        }
    }
});
exports.AcceptFriendRequestController = AcceptFriendRequestController;
const RejectOrCancelFriendRequestController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRes = (0, express_validator_1.validationResult)(req);
    if (!validatedRes.isEmpty()) {
        return next(new error_1.BodyValidationError(validatedRes.array()));
    }
    const userId = req.user.id;
    const { friendId } = req.body;
    try {
        yield dbClient_1.dbClient.$transaction([
            dbClient_1.dbClient.friendshipRequest.deleteMany({
                where: {
                    OR: [
                        { userId, friendId },
                        { userId: friendId, friendId: userId },
                    ],
                },
            }),
        ]);
        res.status(200).json({ data: true });
    }
    catch (err) {
        return next(new error_1.LoggerApiError(err, 500));
    }
});
exports.RejectOrCancelFriendRequestController = RejectOrCancelFriendRequestController;
const GetPendingRequestsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const isReqSent = req.query.type === "sent";
    const queryObj = isReqSent ? { userId: userId } : { friendId: userId };
    const userOrFriend = isReqSent ? "friend" : "user";
    try {
        const pendingRequests = yield dbClient_1.dbClient.friendshipRequest.findMany({
            where: Object.assign({}, queryObj),
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
            username: pr[userOrFriend][constants_3.USERNAME],
            imageUrl: pr[userOrFriend]["profile"]["picture"],
        }));
        res.status(200).json({ data: flattenRequests });
    }
    catch (error) {
        logger_1.logger.error(error);
        return next(new error_1.LoggerApiError(error, 500));
    }
});
exports.GetPendingRequestsController = GetPendingRequestsController;
const GetAcceptedFriendRequestsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const acceptedFriends = yield dbClient_1.dbClient.user.findMany({
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
        });
        const flattenData = acceptedFriends.flatMap((item) => [
            ...item.friendshipAsUser1.map(({ user2 }) => {
                var _a;
                return ({
                    userId: user2.id,
                    username: user2.username,
                    imageUrl: (_a = user2.profile) === null || _a === void 0 ? void 0 : _a.picture,
                });
            }),
            ...item.friendshipAsUser2.map(({ user1 }) => {
                var _a;
                return ({
                    userId: user1.id,
                    username: user1.username,
                    imageUrl: (_a = user1.profile) === null || _a === void 0 ? void 0 : _a.picture,
                });
            }),
        ]);
        res.status(200).json({ data: flattenData });
    }
    catch (err) {
        return next(new error_1.LoggerApiError(err, 500));
    }
});
exports.GetAcceptedFriendRequestsController = GetAcceptedFriendRequestsController;
