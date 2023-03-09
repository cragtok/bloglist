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
    response
        .status(404)
        .send({ name: "UnknownEndpointError", error: "Unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response
            .status(400)
            .send({ name: error.name, error: "Malformatted id" });
    } else if (error.name === "ValidationError") {
        return response
            .status(400)
            .json({ name: error.name, error: error.message });
    } else if (error.name === "JsonWebTokenError") {
        return response
            .status(401)
            .json({ name: error.name, error: "Invalid or missing token" });
    } else if (error.name === "NotFoundError") {
        return response
            .status(404)
            .json({ name: error.name, error: error.message });
    } else if (error.name === "AuthenticationError") {
        return response
            .status(401)
            .json({ name: error.name, error: error.message });
    }

    next(error);
};

const userExtractor = async (request, response, next) => {
    if (request.url === "/api/users" && request.method === "POST") {
        return next();
    }

    const authorization = request.get("authorization");

    if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
        return next({ name: "JsonWebTokenError" });
    }

    const token = authorization.substring(7);
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);

        if (decodedToken.id) {
            const user = await User.findById(decodedToken.id);
            if (user) {
                request.user = user;
                return next();
            }
        }
    } catch (error) {
        next(error);
    }
    return next({ name: "JsonWebTokenError" });
};

module.exports = {
    userExtractor,
    requestLogger,
    unknownEndpoint,
    errorHandler,
};
