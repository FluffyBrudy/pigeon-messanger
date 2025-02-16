import { Router } from "express";
import { RegisterController } from "../controller/auth/RegisterController";
import { loginValidator, registerValidator } from "../validator/auth/auth";
import { LoginController } from "../controller/auth/LoginController";
import { AUTH } from "./constants";

const authRouter = Router();

authRouter.post(AUTH.REGISTER, registerValidator, RegisterController);
authRouter.post(AUTH.LOGIN, loginValidator, LoginController);

export { authRouter };
