"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const FindFriendsController_1 = require("../controller/social/FindFriendsController");
const social_1 = require("../validator/social/social");
const FriendRequestController_1 = require("../controller/social/FriendRequestController");
const constants_1 = require("./constants");
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 50,
});
const socialRouter = (0, express_1.Router)();
exports.socialRouter = socialRouter;
socialRouter.post(constants_1.SOCIAL.FRIENDS_SEARCH, limiter, social_1.findFriendsValidator, FindFriendsController_1.FindFriendsController);
socialRouter.post(constants_1.SOCIAL.FRIEND_REQUEST, social_1.addFriendValidation, FriendRequestController_1.AddFriendController);
socialRouter.get(constants_1.SOCIAL.PENDING_REQUESTS, FriendRequestController_1.GetPendingRequestsController);
socialRouter.get(constants_1.SOCIAL.ACCEPTED_REQUESTS, FriendRequestController_1.GetAcceptedFriendRequestsController);
socialRouter.post(constants_1.SOCIAL.ACCEPT_REQUEST, social_1.accetpFriendValidation, FriendRequestController_1.AcceptFriendRequestController);
socialRouter.post(constants_1.SOCIAL.REJECT_REQUEST, social_1.deleteOrCancelPendingRequestValidation, FriendRequestController_1.RejectOrCancelFriendRequestController);
