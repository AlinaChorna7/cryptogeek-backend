import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { loginUserController, logoutUserController, registerUserController } from "../controllers/auth.js";
import { validateBody } from "../middleware/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";

const AuthRouter = Router();

AuthRouter.post('/register', ctrlWrapper(registerUserController), validateBody(registerUserSchema));

AuthRouter.post('/login', ctrlWrapper(loginUserController), validateBody(loginUserSchema));

AuthRouter.post('/logout', ctrlWrapper(logoutUserController));
export default AuthRouter;
