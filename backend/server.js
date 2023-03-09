const app = require("./app");
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");

const mongoose = require("mongoose");
const server = http.createServer(app);
const port = config.PORT || 3003;

logger.info("connecting to MongoDB");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", true);
        const connection = await mongoose.connect(config.MONGODB_URI);
        logger.info(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
};

connectDB().then(() => {
    server.listen(port, () => {
        logger.info(
            `Server running on port ${port} in ${process.env.NODE_ENV} mode`
        );
    });
});
