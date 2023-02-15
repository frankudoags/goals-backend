import { Router } from "express";
import {
  forgotPasswordHandler,
  getMeHandler,
  loginHandler,
  logoutHandler,
  resetPasswordHandler,
  signupHandler,
  updatePasswordHandler,
} from "../controllers/userController";
import protectRoute from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.post("/signup", signupHandler);

userRouter.post("/login", loginHandler);

userRouter.get("/logout", protectRoute, logoutHandler);

userRouter.get("/me", protectRoute, getMeHandler);

//Password Routes
userRouter.post("/forgotpassword", forgotPasswordHandler);

userRouter.post("/resetpassword/:resettoken", resetPasswordHandler);

userRouter.post("/updatepassword", protectRoute, updatePasswordHandler);


export default userRouter;
