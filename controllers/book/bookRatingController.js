import Joi from "joi";
import { BookRating } from "../../models";

const bookRatingController = {
  // ! Create book rating
  async createBookRating(req, res, next) {
    const bookRatingSchema = Joi.object({
      note: Joi.string().required(),
      rate: Joi.number().min(1).max(5).required(),
    });

    const { error } = bookRatingSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const userId = req.user._id;
      const { bookId } = req.params;
      const { note, rate } = req.body;

      const rating = await BookRating.create({
        bookId,
        userId,
        note,
        rate,
      });
      return res
        .status(200)
        .json({ message: "Rating created successfully", rating });
    } catch (error) {
      return next(error);
    }
  },

  //! Get all ratings for a book
  async getBookRatings(req, res, next) {
    const { bookId } = req.params;
    const rating = await BookRating.find({ bookId }).populate("userId", "name");
    res.status(200).json({ rating });
  },

  //! update book rating
  async updateBookRating(req, res, next) {
    const ratingSchema = Joi.object({
      note: Joi.string().required(),
      rate: Joi.number().min(1).max(5).required(),
    });

    const { error } = ratingSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const { ratingId } = req.params;
      const { note, rate } = req.body;
      const userId = req.user._id;

      const rating = await BookRating.findByIdAndUpdate(
        { _id: ratingId, userId },
        { note, rate },
        { new: true }
      );
      if (!rating) {
        return res
          .status(404)
          .json({ message: "Rating not found or unauthorized" });
      }
      res.status(200).json({
        message: "Rating updated successfully",
        rating,
      });
    } catch (error) {
      return next(error);
    }
  },

  //! delete book rating
  async deleteBookRating(req, res, next) {
    try {
      const { ratingId } = req.params;
      const userId = req.user._id;
      const rating = await BookRating.findOneAndDelete({
        _id: ratingId,
        userId,
      });
      if (!rating) {
        return res
          .status(404)
          .json({ message: "Rating not found or unauthorized" });
      }
      res.status(200).json({
        message: "Rating deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default bookRatingController;
