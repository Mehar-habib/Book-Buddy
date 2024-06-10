import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    text: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const discussionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Discussion", discussionSchema, "discussions");
