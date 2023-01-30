import { Router } from "express";
import { homeHandler } from "../controllers/dummyController";

const dummyRouter: Router = Router();

dummyRouter.get("/", homeHandler);

export default dummyRouter;
