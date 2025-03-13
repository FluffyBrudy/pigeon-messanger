import { Router } from "express";
import { ExpressUser } from "../types/common";
import { SILENT } from "./constants";
import { ApiError, LoggerApiError } from "../error/error";
import { dbClient } from "../service/dbClient";
import { INVALID_CREDENTIALS } from "../controller/auth/constants";

const silentRouter = Router();
silentRouter.post(SILENT.LOGIN, async (req, res, next) => {
  const id = (req.user as ExpressUser).id;
  try {
    const user = await dbClient.user.findUnique({
      where: { id },
      select: {
        id: true,
        password: true,
        username: true,
        profile: { select: { initialized: true, picture: true } },
      },
    });
    if (!user) return next(new ApiError(401, INVALID_CREDENTIALS, true));

    res.json({
      data: {
        id: user.id,
        username: user.username,
        initialized: user.profile?.initialized,
        imageUrl: user.profile?.picture,
      },
    });
  } catch (err) {
    return next(new LoggerApiError(err, 500));
  }
});

export { silentRouter };
