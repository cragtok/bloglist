const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response, next) => {
    const { username, password } = request.body;
    if (!username || !password) {
        return response
            .status(400)
            .json({ error: "Username or password is missing" });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return response
                .status(404)
                .json({ error: "Username does not exist" });
        }
        const passwordCorrect =
            user === null
                ? false
                : await bcrypt.compare(password, user.passwordHash);

        if (!(user && passwordCorrect)) {
            return response.status(401).json({ error: "Invalid password" });
        }

        const userForToken = {
            username: user.username,
            id: user._id,
        };

        const token = jwt.sign(userForToken, process.env.SECRET);

        response.status(200).send({
            token,
            id: user._id,
            username: user.username,
            name: user.name,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = loginRouter;
