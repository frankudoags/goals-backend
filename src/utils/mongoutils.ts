import mongoose from "mongoose";
import { Unauthorized } from "./errors";

export const checkObjectId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
};

export const checkOwnership = (
  goalUserId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
    if (goalUserId.toString() !== userId.toString())
    throw new Unauthorized("Access denied");
};

