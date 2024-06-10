import Joi from "joi";
import { Book } from "../../models";

const bookController = {
  // !createBook controller
  async createBook(req, res, next) {
    const bookSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().required(),
      isbn: Joi.number().required(),
      publisher: Joi.string().required(),
      genre: Joi.array().items(Joi.string()).required(),
      imagePath: Joi.string().required(),
    });
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const userId = req.user._id;
    try {
      const result = await Book.create({ ...req.body, user: userId });
      res
        .status(201)
        .json({ message: "Book created successfully", book: result });
    } catch (err) {
      return next(err);
    }
  },

  //! updateBook controller
  async updateBook(req, res, next) {
    const bookSchema = Joi.object({
      title: Joi.string(),
      author: Joi.string(),
      isbn: Joi.number(),
      publisher: Joi.string(),
      genre: Joi.array().items(Joi.string()),
      imagePath: Joi.string(),
    });
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const userId = req.user._id;
      const book = await Book.findOne({ _id: req.params.id, user: userId });
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      const result = await Book.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { new: true }
      );
      if (!result) {
        return res.status(404).json({ message: "Book not found" });
      }
      res
        .status(200)
        .json({ message: "Book updated successfully", book: result });
    } catch (error) {
      return next(error);
    }
  },

  //   ! readBook controller
  async readBook(req, res, next) {
    const userId = req.user._id;
    try {
      const result = await Book.findById({ _id: req.params.id, user: userId });
      if (!result) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(200).json({ book: result });
    } catch (error) {
      return next(error);
    }
  },

  // ! deleteBook controller
  async deleteBook(req, res, next) {
    const userId = req.user._id;
    try {
      const book = await Book.findOne({ _id: req.params.id, user: userId });
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      const result = await Book.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      return next(error);
    }
  },
};

export default bookController;
