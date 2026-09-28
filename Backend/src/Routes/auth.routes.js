import { Router } from "express";
import { registerValidator } from "../Validation/Register.Validetor.js";
import { login, logout, me, refresh, Register } from "../Controller/auth.controller.js";
import { loginValidator } from "../Validation/Login.validator.js";
import { authverify } from "../Middleware/auth.middleware.js";

const AuthRouter = Router();

AuthRouter.post("/register", registerValidator, Register);
AuthRouter.post("/login", loginValidator, login);
AuthRouter.get("/get-me", authverify, me);
AuthRouter.post("/refresh-token", refresh);
AuthRouter.post("/logout", authverify, logout);

export default AuthRouter;
