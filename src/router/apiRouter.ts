import { Router } from "express";
import { authRouter } from "./authRouter";
import { socialRouter } from "./socialRouter";
import { silentRouter } from "./silentRouter";
import { verifyAuth } from "../middleware/authVerification";
import { AUTH, CHAT, PREFERENCE, SILENT, SOCIAL } from "./constants";
import { chatRouter } from "./chatRouter";
import { preferanceRouter } from "./preferenceRouter";

const apiRouter = Router();

apiRouter.use(AUTH.ROOT, authRouter);

apiRouter.use(verifyAuth());

apiRouter.use(SILENT.ROOT, silentRouter);
apiRouter.use(SOCIAL.ROOT, socialRouter);
apiRouter.use(CHAT.ROOT, chatRouter);
apiRouter.use(PREFERENCE.ROOT, preferanceRouter);

export { apiRouter };
