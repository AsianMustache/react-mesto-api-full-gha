const express = require("express");
// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { errors: celebrateErrors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errors");
const NotFoundError = require("./utils/NotFoundError");
const cors = require("./middlewares/cors");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Подключение установлено");
  })
  .catch((err) => {
    console.log("Ошибка подключения:", err.message);
  });

app.use(requestLogger);
app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use("/", router);

app.use("*", (req, res, next) => {
  console.error(`Запрошен несуществующий маршрут: ${req.path}`);
  next(new NotFoundError("Страница не найдена"));
});

app.use(errorLogger);
app.use(celebrateErrors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
