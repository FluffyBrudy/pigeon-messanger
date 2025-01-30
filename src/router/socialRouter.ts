import { Router } from "express";
import rateLimit from "express-rate-limit";
import { FindFriendsController } from "../controller/social/FindFriendsController";
import {
  accetpFriendValidation,
  addFriendValidation,
  findFriendsValidator,
} from "../validator/social/social";
import { verifyAuth } from "../middleware/authVerification";
import {
  AcceptFriendRequestController,
  AddFriendController,
  PendingFriendRequestsController,
} from "../controller/social/FriendRequestController";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
});

const socialRouter = Router();

socialRouter.post(
  "/friends-search",
  limiter,
  verifyAuth(),
  findFriendsValidator,
  FindFriendsController
);

socialRouter.post(
  "/add-friend-request",
  verifyAuth(),
  addFriendValidation,
  AddFriendController
);

socialRouter.get(
  "/pending-friends-request",
  verifyAuth(),
  PendingFriendRequestsController
);

socialRouter.post(
  "/friend-request-accept",
  verifyAuth(),
  accetpFriendValidation,
  AcceptFriendRequestController
);

export { socialRouter };
