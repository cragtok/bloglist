const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username is already taken"],
        required: [true, "Username is required."],
        minLength: [3, "Username must be at least 3 characters long"],
        maxLength: [20, "Username must be shorter than 21 characters"],
    },
    passwordHash: {
        type: String,
        required: [true, "Password is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required."],
        minLength: [3, "Name must be at least 3 characters long"],
        maxLength: [20, "Name must be shorter than 21 characters"],
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
