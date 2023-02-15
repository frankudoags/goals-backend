import { Schema, model } from "mongoose";

const goalSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a goal name"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Goal = model("Goal", goalSchema);

export default Goal;
