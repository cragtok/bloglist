const express = require("express");
const cors = require("cors");
const path = require("path");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const middleware = require("./utils/middleware");

const app = express();

app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);
if (process.env.NODE_ENV === "production") {
    app.use(express.static("build"));
    app.get("/*", function (req, res, next) {
        if (req.url.includes("/api")) {
            return next();
        }
        res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
            if (err) {
                res.status(500).send(err);
            }
        });
    });
}

app.use("/api/login", loginRouter);
app.use(middleware.userExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
