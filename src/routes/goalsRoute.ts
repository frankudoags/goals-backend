import { Router } from "express";
import {
  getGoalsHandler,
  createGoalHandler,
  updateGoalHandler,
  deleteGoalHandler,
} from "../controllers/goalsController";
import protectRoute from "../middleware/authMiddleware";

const goalsRouter = Router();

goalsRouter.get("/", protectRoute, getGoalsHandler);

goalsRouter.post("/", protectRoute, createGoalHandler);

goalsRouter.put("/:id", protectRoute, updateGoalHandler);

goalsRouter.delete("/:id", protectRoute, deleteGoalHandler);

export default goalsRouter;
