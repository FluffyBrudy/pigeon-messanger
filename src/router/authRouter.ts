import { Router } from "express";
import { RegisterController } from "../controller/auth/RegisterController";
import { loginValidator, registerValidator } from "../validator/auth/auth";
import { LoginController } from "../controller/auth/LoginController";

const authRouter = Router();

authRouter.post("/register", registerValidator, RegisterController);
authRouter.post("/login", loginValidator, LoginController);

export { authRouter };
