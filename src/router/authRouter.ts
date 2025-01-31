import { Router } from "express";
import { RegisterController } from "../controller/auth/RegisterController";
import { loginValidator, registerValidator } from "../validator/auth/auth";
import { LoginController } from "../controller/auth/LoginController";
import { verifyAuth } from "../middleware/authVerification";
import { ExpressUser } from "../types/common";

const authRouter = Router();

authRouter.post("/register", registerValidator, RegisterController);
authRouter.post("/login", loginValidator, LoginController);
authRouter.post("/silent-login", verifyAuth(), (req, res) => {
  const id = (req.user as ExpressUser).id;
  res.json({ data: { id } });
});

export { authRouter };
