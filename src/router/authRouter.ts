import { Router } from "express";
import { RegisterController } from "../controller/auth/RegisterController";
import { loginValidator, registerValidator } from "../validator/auth/auth";
import { LoginController } from "../controller/auth/LoginController";
import { verifyAuth } from "../middleware/authVerification";

const authRouter = Router();

authRouter.post("/register", registerValidator, RegisterController);
authRouter.post("/login", loginValidator, LoginController);
authRouter.post("/silent-login", verifyAuth(), (_, res) => {
  res.json({ data: { isAuthorized: true } });
});

export { authRouter };
