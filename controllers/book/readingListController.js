import Joi from "joi";
import { ReadingList } from "../../models";

const readingListController = {
  // ! create reading list
  async createReadingList(req, res, next) {
    const readingListSchema = Joi.object({
      title: Joi.string().required(),
      bookIds: Joi.array().items(Joi.string()),
    });
    const { error } = readingListSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const { _id: userId } = req.user;
      const result = await ReadingList.create({
        userId,
        bookIds: [],
        ...req.body,
      });
      res.status(201).json({
        message: "Reading List created successfully",
        readingList: result,
      });
    } catch (error) {
      return next(error);
    }
  },

  //   ! read book list
  async readBookList(req, res, next) {
    try {
      const userId = req.user._id;
      const books = await ReadingList.find({ userId: userId }).populate(
        "bookIds"
      );

      res.status(200).json({ books });
    } catch (error) {
      next(error);
    }
  },

  //   ! update book list
  async updateBookList(req, res, next) {
    const bookId = req.params.bookId;
    const listId = req.params.listId;

    try {
      const userId = req.user._id;

      const readingList = await ReadingList.findOneAndUpdate(
        {
          _id: listId,
          userId: userId,
        },
        {
          $push: { bookIds: bookId },
        },
        {
          new: true,
        }
      ).populate("bookIds");

      res
        .status(200)
        .json({ message: "Reading list updated successfully", readingList });
    } catch (error) {
      return next(error);
    }
  },

  //   ! delete book list
  async deleteBookList(req, res, next) {
    const bookId = req.params.bookId;
    const listId = req.params.listId;

    try {
      const userId = req.user._id;

      const readingList = await ReadingList.findOneAndUpdate(
        {
          _id: listId,
          userId: userId,
        },
        {
          $pull: { bookIds: bookId },
        },
        {
          new: true,
        }
      ).populate("bookIds");

      res
        .status(200)
        .json({ message: "Reading list updated successfully", readingList });
    } catch (error) {
      return next(error);
    }
  },
};

export default readingListController;
