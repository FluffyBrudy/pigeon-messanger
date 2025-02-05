import { Router } from "express";
import { authRouter } from "./authRouter";
import { socialRouter } from "./socialRouter";
import { silentRouter } from "./silentRouter";
import { verifyAuth } from "../middleware/authVerification";
import { AUTH, SILENT, SOCIAL } from "./constants";

const apiRouter = Router();

apiRouter.use(AUTH.ROOT, authRouter);

apiRouter.use(verifyAuth());
apiRouter.use(SILENT.ROOT, silentRouter);
apiRouter.use(SOCIAL.ROOT, socialRouter);

export { apiRouter };
