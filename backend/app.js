const express = require("express");
const app = express();
const cors = require("cors");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const middleware = require("./utils/middleware");

app.use(cors());

if (process.env.NODE_ENV === "production") {
    console.log("HELLO");
    app.use(express.static("build"));
}
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/login", loginRouter);
app.use(middleware.userExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
