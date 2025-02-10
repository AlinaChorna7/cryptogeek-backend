import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { loginUserController, logoutUserController, refreshUsersSessionController, registerUserController } from "../controllers/auth.js";
import { validateBody } from "../middleware/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";
// import { authenticate } from "../middleware/authenticate.js";

const AuthRouter = Router();

// AuthRouter.use(authenticate);

AuthRouter.post('/register', ctrlWrapper(registerUserController), validateBody(registerUserSchema));

AuthRouter.post('/login', ctrlWrapper(loginUserController), validateBody(loginUserSchema));

AuthRouter.post('/logout', ctrlWrapper(logoutUserController));

AuthRouter.post('/refresh', ctrlWrapper(refreshUsersSessionController));


export default AuthRouter;
