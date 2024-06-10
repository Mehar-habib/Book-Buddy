import Joi from "joi";
import { Discussion } from "../../models";

const discussionController = {
  // ! create discussion
  async createDiscussion(req, res, next) {
    const discussionSchema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    });

    const { error } = discussionSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const { title, description } = req.body;
      const userId = req.user._id;
      if (!userId) throw new Error("User not found");

      const discussion = await Discussion.create({
        userId,
        title,
        description,
        messages: [],
      });
      res
        .status(200)
        .json({ message: "Discussion created successfully", discussion });
    } catch (error) {
      return next(error);
    }
  },

  // !   // Add a message to an existing discussion
  async addMessage(req, res, next) {
    const messageSchema = Joi.object({
      text: Joi.string().required(),
    });

    const { error } = messageSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const { text } = req.body;
      const userId = req.user._id;
      const { discussionId } = req.params;

      const discussion = await Discussion.findById(discussionId);
      if (!discussion) throw new Error("Discussion not found");

      discussion.messages.push({ text, user: userId });
      await discussion.save();

      return res
        .status(200)
        .json({ message: "Message added successfully", discussion });
    } catch (error) {
      return next(error);
    }
  },

  //! Get all discussions
  async getDiscussionMessages(req, res, next) {
    try {
      const discussion = await Discussion.find();
      return res.status(200).json({ discussion });
    } catch (error) {
      return next(error);
    }
  },

  //! Get a specific discussion by ID
  async getDiscussionById(req, res, next) {
    try {
      const { discussionId } = req.params;
      const discussion = await Discussion.findById(discussionId).populate(
        "messages.user",
        "name email"
      );
      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      res.status(200).json({ discussion });
    } catch (error) {
      return next(error);
    }
  },
};

export default discussionController;
