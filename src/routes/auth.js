import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getGoogleAuthURLController, loginUserController, logoutUserController, refreshUsersSessionController, registerUserController , loginWithGoogleController} from "../controllers/auth.js";
import { validateBody } from "../middleware/validateBody.js";
import { loginUserSchema, loginWithGoogleOAuthSchema, registerUserSchema } from "../validation/auth.js";


const AuthRouter = Router();



AuthRouter.post('/register', ctrlWrapper(registerUserController), validateBody(registerUserSchema));

AuthRouter.post('/login', ctrlWrapper(loginUserController), validateBody(loginUserSchema));

AuthRouter.post('/logout', ctrlWrapper(logoutUserController));

AuthRouter.post('/refresh', ctrlWrapper(refreshUsersSessionController));

AuthRouter.get('/get-oauth-url', ctrlWrapper(getGoogleAuthURLController));

AuthRouter('/confirm-oauth', validateBody(loginWithGoogleOAuthSchema), ctrlWrapper(loginWithGoogleController));


export default AuthRouter;
