const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, "Comment body required"],
            minlength: [5, "Comment body must be at least 1 characters long"],
            maxlength: [
                100,
                "Comment body must be shorter than 100 characters",
            ],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

commentSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
