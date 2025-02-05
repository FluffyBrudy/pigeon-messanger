import { Router } from "express";
import rateLimit from "express-rate-limit";
import { FindFriendsController } from "../controller/social/FindFriendsController";
import {
  accetpFriendValidation,
  addFriendValidation,
  findFriendsValidator,
  deleteOrCancelPendingRequestValidation,
} from "../validator/social/social";

import {
  AcceptFriendRequestController,
  AddFriendController,
  GetAcceptedFriendRequestsController,
  GetPendingRequestsController,
  RejectOrCancelFriendRequestController,
} from "../controller/social/FriendRequestController";
import { SOCIAL } from "./constants";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
});

const socialRouter = Router();

socialRouter.post(
  SOCIAL.FRIENDS_SEARCH,
  limiter,

  findFriendsValidator,
  FindFriendsController
);

socialRouter.post(
  SOCIAL.FRIEND_REQUEST,
  addFriendValidation,
  AddFriendController
);

socialRouter.get(SOCIAL.PENDING_REQUESTS, GetPendingRequestsController);

socialRouter.get(SOCIAL.ACCEPTED_REQUESTS, GetAcceptedFriendRequestsController);

socialRouter.post(
  SOCIAL.ACCEPT_REQUEST,
  accetpFriendValidation,
  AcceptFriendRequestController
);

socialRouter.post(
  SOCIAL.REJECT_REQUEST,
  deleteOrCancelPendingRequestValidation,
  RejectOrCancelFriendRequestController
);

export { socialRouter };
