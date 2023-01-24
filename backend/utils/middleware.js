const jwt = require("jsonwebtoken");
const logger = require("./logger");

const User = require("../models/user");

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "Malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "Invalid token" });
    }

    next(error);
};

const userExtractor = async (request, response, next) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        const token = authorization.substring(7);
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            if (decodedToken.id) {
                const user = await User.findById(decodedToken.id);
                if (user) {
                    request.user = user;
                }
            }
        } catch (error) {
            next(error);
        }
    }
    next();
};

module.exports = {
    userExtractor,
    requestLogger,
    unknownEndpoint,
    errorHandler,
};
