import { Router } from "express";
import rateLimit from "express-rate-limit";
import { FindFriendsController } from "../controller/social/FindFriends";
import { findFriendsValidator } from "../validator/social/social";
import { verifyAuth } from "../middleware/authVerification";

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

export { socialRouter };
