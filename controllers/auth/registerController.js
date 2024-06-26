import Joi from "joi";
import CustomerErrorHandler from "../../services/CustomErrorHandler";
import { RefreshToken, User } from "../../models";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const registerController = {
  // ! register controller
  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // check if user is in the database already
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomerErrorHandler.alreadyExist("This email is already exist")
        );
      }
    } catch (err) {
      return next(err);
    }
    const { name, email, password } = req.body;
    // todo ==> Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // todo ==> prepare the model
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    let access_token;
    let refresh_token;
    try {
      const result = await user.save();
      // todo ==> Token
      access_token = JwtService.sign({
        _id: result._id,
        role: result.role,
      });

      refresh_token = JwtService.sign(
        { _id: result._id, role: result.role },
        "2y",
        REFRESH_SECRET
      );
      // todo ==> create model & Save Token in database
      await RefreshToken.create({ token: refresh_token });
    } catch (err) {
      return next(err);
    }
    res.json({ access_token, refresh_token });
  },

  //! genre Function
  async genre(req, res, next) {
    const genreSchema = Joi.object({
      genre: Joi.array().items(Joi.string()).required(),
    });
    const { error } = genreSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const result = await User.findOneAndUpdate(
        { _id: req.params.id },
        { genre: req.body.genre },
        { new: true }
      );
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: "Genre updated Successful", user: result });
    } catch (error) {
      return next(error);
    }
  },
};
export default registerController;
