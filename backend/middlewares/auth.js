// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../utils/UnauthorizedError");

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError("Требуется авторизация"));
  }

  try {
    const payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
    req.user = payload;
    next();
  } catch (err) {
    console.error("Auth Middleware: Ошибка при проверке токена", err);
    next(new UnauthorizedError("Неверный токен"));
  }
};

module.exports = auth;
