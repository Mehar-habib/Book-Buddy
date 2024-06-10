import mongoose, { Schema } from "mongoose";

const ReadingListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  bookIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
export default mongoose.model("ReadingList", ReadingListSchema, "readingLists");
