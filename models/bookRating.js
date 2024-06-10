import mongoose, { Schema } from "mongoose";

const bookRatingSchema = new Schema(
  {
    note: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: false }
);
export default mongoose.model("BookRating", bookRatingSchema, "bookRatings");
