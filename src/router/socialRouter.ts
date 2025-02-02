import { Router } from "express";
import rateLimit from "express-rate-limit";
import { FindFriendsController } from "../controller/social/FindFriendsController";
import {
  accetpFriendValidation,
  addFriendValidation,
  findFriendsValidator,
} from "../validator/social/social";

import {
  AcceptFriendRequestController,
  AddFriendController,
  GetAcceptedFriendRequestsController,
  GetPendingRequestsController,
} from "../controller/social/FriendRequestController";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
});

const socialRouter = Router();

socialRouter.post(
  "/friends-search",
  limiter,

  findFriendsValidator,
  FindFriendsController
);

socialRouter.post(
  "/add-friend-request",
  addFriendValidation,
  AddFriendController
);

socialRouter.get("/pending-friends-request", GetPendingRequestsController);

socialRouter.get(
  "/accepted-friend-request",
  GetAcceptedFriendRequestsController
);

socialRouter.post(
  "/friend-request-accept",
  accetpFriendValidation,
  AcceptFriendRequestController
);

export { socialRouter };
