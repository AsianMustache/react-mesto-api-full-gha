const mongoose = require("mongoose");
// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config();
const http2 = require("http2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../utils/BadRequestError");
const NotFoundError = require("../utils/NotFoundError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const ConflictError = require("../utils/ConflictError");

// Получение всех пользователей
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(http2.constants.HTTP_STATUS_OK).json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    let userId;

    if (req.params.userId === "me" && req.user) {
      userId = req.user._id;
    } else {
      userId = req.params.userId;
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError("Некорректный ID пользователя");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Пользователь не найден");
    }

    res.status(http2.constants.HTTP_STATUS_OK).json(user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json({
      email: newUser.email,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError("Пользователь с таким email уже существует"));
    } else if (err.name === "ValidationError") {
      next(new BadRequestError("Неверный формат входных данных"));
    } else {
      next(err);
    }
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Данных с указанным id не существует"));
    res.status(http2.constants.HTTP_STATUS_OK).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Неверный формат входных данных"));
    } else {
      next(err);
    }
  }
};

// Обновление аватара пользователя
exports.updateAvatar = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Данных с указанным id не существует"));
    res.status(http2.constants.HTTP_STATUS_OK).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Неверный формат входных данных"));
    } else {
      next(err);
    }
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { NODE_ENV, JWT_SECRET } = process.env;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Неверные почта или пароль");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Неверные почта или пароль");
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });
    res
      .status(http2.constants.HTTP_STATUS_OK)
      .send({ token, email: user.email, id: user._id });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new Error("Пользователь не авторизован");
    }

    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Пользователь не найден");
    }

    res.status(http2.constants.HTTP_STATUS_OK).json({
      name: user.name,
      email: user.email,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    });
  } catch (error) {
    next(error);
  }
};
