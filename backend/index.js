const app = require("./app");
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");

const mongoose = require("mongoose");
const server = http.createServer(app);
const port = config.PORT || 3003;

logger.info("connecting to MongoDB");

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
        server.listen(port, () => {
            logger.info(
                `Server running on port ${port} in ${process.env.NODE_ENV} mode`
            );
        });
    })
    .catch(error => {
        logger.error("error connecting to MongoDB:", error.message);
    });
