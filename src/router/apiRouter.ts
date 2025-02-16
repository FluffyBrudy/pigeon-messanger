import { Router } from "express";
import { authRouter } from "./authRouter";
import { socialRouter } from "./socialRouter";
import { silentRouter } from "./silentRouter";
import { verifyAuth } from "../middleware/authVerification";
import { AUTH, CHAT, SILENT, SOCIAL } from "./constants";
import { chatRouter } from "./chatRouter";

const apiRouter = Router();

apiRouter.use(AUTH.ROOT, authRouter);

apiRouter.use(verifyAuth());
apiRouter.use(SILENT.ROOT, silentRouter);
apiRouter.use(SOCIAL.ROOT, socialRouter);
apiRouter.use(CHAT.ROOT, chatRouter);

export { apiRouter };
