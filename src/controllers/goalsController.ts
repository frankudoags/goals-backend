import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Goal from "../db/models/goalModel";
import User from "../db/models/userModel";
import { BadRequest } from "../utils/errors";
import { checkObjectId, checkOwnership } from "../utils/mongoutils";

/**
 * @description Get all goals
 * @param req
 * @param res
 * @route GET api/goals
 * @access Public
 */
export const getGoalsHandler = asyncHandler(
  async (req: Request | any, res: Response) => {
    const goals = await Goal.find({ user: req.user._id });
    res.status(200).send(goals);
  }
);

/**
 * @description create a new Goal
 * @param req
 * @param res
 * @route   POST api/goals
 * @access  Public
 */
export const createGoalHandler = asyncHandler(
  async (req: Request | any, res: Response) => {
    const { name, description } = req.body;
    //error handling
    if (!name || !description) throw new BadRequest('Please fill in all fields');

    const goal = await Goal.create({
      name,
      description,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: goal,
      message: "Goal created",
    });
  }
);

/**
 * @description update a Goal
 * @param req
 * @param res
 * @route  PUT api/goals/:id
 * @access Public
 */
export const updateGoalHandler = asyncHandler(
  async (req: Request | any, res: Response) => {
    const { id } = req.params;
    //check if id is valid mongo id
    checkObjectId(id);

    //destructure req.body and get name, description and completed status
    const { name, description, completed } = req.body;

    //check that all fields are complete
    if (!name || !description || (completed === null || undefined)) {
      throw new BadRequest("Please fill in all fields");
    }

    //check if goal exists and throw error if it doesn't
    let goalcheck = await Goal.findById(id);
    if (!goalcheck) throw new BadRequest("Goal not found");
    
    //check that caller is the owner of the goal
    checkOwnership(goalcheck.user, req.user._id);

    //update goal
    const goal = await Goal.findByIdAndUpdate(
      id,
      {
        name,
        description,
        completed,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: goal,
      message: "Goal updated",
    });
  }
);

/**
 * @description delete a Goal
 * @param req
 * @param res
 * @route  DELETE api/goals/:id
 * @access Public
 */
export const deleteGoalHandler = asyncHandler(
  async (req: Request | any, res: Response) => {
    //destructuring id from req.params
    const { id } = req.params;

    //check if id is valid mongo id
    checkObjectId(id);

    //check if goal exists and throw error if it doesn't
    let goalcheck = await Goal.findById(id);
    if (!goalcheck) throw new BadRequest("Goal not found");

    //check that caller is the owner of the goal
    checkOwnership(goalcheck.user, req.user._id);

    //delete goal
    await Goal.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Goal deleted",
    });
  }
);
