const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
    const user = request.user;

    if (!user) {
        return response.status(401).json({ error: "token missing or invalid" });
    }

    const users = await User.find({}).populate("blogs", {
        author: 1,
        title: 1,
        likes: 1,
        url: 1,
        createdAt: 1,
        comments: 1,
    });

    response.json(users);
});

usersRouter.get("/:id", async (request, response, next) => {
    const user = request.user;

    if (!user) {
        return response.status(401).json({ error: "token missing or invalid" });
    }

    try {
        const user = await User.findById(request.params.id).populate("blogs", {
            author: 1,
            title: 1,
            likes: 1,
            url: 1,
            createdAt: 1,
            comments: 1,
        });

        if (user) {
            response.json(user);
        } else {
            response.status(404).end();
        }
    } catch (error) {
        next(error);
    }
});

usersRouter.post("/", async (request, response, next) => {
    const { username, password, name } = request.body;

    if (password === undefined || password.length < 3) {
        return response
            .status(400)
            .json({
                error: "Password validation failed: Password must be at least 3 characters long.",
            })
            .end();
    }
    const saltRounds = 10;
    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({ passwordHash, username, name });

        const savedUser = await user.save();
        response.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
});

module.exports = usersRouter;
