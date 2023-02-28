const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({})
        .populate("user", {
            username: 1,
            name: 1,
            userLikes: 1,
        })
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: { username: 1 },
            },
        });
    response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
            .populate("user", {
                username: 1,
                name: 1,
                userLikes: 1,
            })
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: { username: 1 },
                },
            });

        if (blog) {
            response.json(blog);
        } else {
            next({
                name: "NotFoundError",
                message: "Blog not found",
            });
        }
    } catch (error) {
        next(error);
    }
});

blogsRouter.post("/", async (request, response, next) => {
    const body = request.body;
    const user = request.user;
    if (!user) {
        return next({ name: "JsonWebTokenError" });
    }
    try {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            user: user._id,
        });
        const newBlog = await blog.save();
        user.blogs = user.blogs.concat(newBlog._id);
        await user.save();
        await newBlog.populate("user", {
            username: 1,
            name: 1,
            userLikes: 1,
        });

        response.status(201).json(newBlog);
    } catch (error) {
        next(error);
    }
});

blogsRouter.delete("/:id", async (request, response, next) => {
    try {
        const user = request.user;
        if (!user) {
            return next({ name: "JsonWebTokenError" });
        }

        const blog = await Blog.findById(request.params.id);
        if (!blog) {
            return next({
                name: "NotFoundError",
                message: "Blog does not exist or has already deleted",
            });
        }
        if (blog.user.toString() !== user._id.toString()) {
            return next({
                name: "AuthenticationError",
                message: "Authorization denied",
            });
        }
        user.blogs = user.blogs.filter(
            blog => blog.id.toString() !== blog._id.toString()
        );
        await user.save();
        await blog.delete();
        response.status(204).end();
    } catch (error) {
        next(error);
    }
});

blogsRouter.put("/:id", async (request, response, next) => {
    const body = request.body;

    const user = request.user;
    if (!user) {
        return next({ name: "JsonWebTokenError" });
    }

    try {
        const blogToUpdate = await Blog.findById(request.params.id);

        if (!blogToUpdate) {
            return next({
                name: "NotFoundError",
                message: "Blog not found",
            });
        }

        if (body.action !== "like" && body.action !== "unlike") {
            return next({
                name: "ValidationError",
                message: "Blog update action must be 'like' or 'unlike'",
            });
        }
        const userLikesId = blogToUpdate.userLikes.find(
            id => id.toString() === user._id.toString()
        );

        if (userLikesId !== undefined && body.action === "like") {
            return next({
                name: "ValidationError",
                message: "You have already liked the blog",
            });
        }

        if (!userLikesId && body.action === "unlike") {
            return next({
                name: "ValidationError",
                message: "You have not liked the blog",
            });
        }

        let updatedLikes;
        let updatedUserLikes;
        if (body.action === "like") {
            updatedLikes = blogToUpdate.likes + 1;
            updatedUserLikes = blogToUpdate.userLikes.concat(user._id);
        }

        if (body.action === "unlike") {
            updatedLikes = blogToUpdate.likes - 1;
            updatedUserLikes = blogToUpdate.userLikes.filter(
                id => id.toString() !== user._id.toString()
            );
        }

        const blog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: updatedLikes,
            user: body.user,
            userLikes: updatedUserLikes,
            comments: body.comments,
        };

        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            blog,
            {
                new: true,
                runValidators: true,
                context: "query",
            }
        )
            .populate("user", {
                username: 1,
                name: 1,
                userLikes: 1,
            })
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: { username: 1 },
                },
            });

        response.json(updatedBlog);
    } catch (error) {
        next(error);
    }
});

// Blog Comment Routers

blogsRouter.post("/:id/comments", async (request, response, next) => {
    const body = request.body;
    const comment = body.comment;
    const user = request.user;

    if (!user) {
        return next({ name: "JsonWebTokenError" });
    }

    if (!comment || comment.length < 1) {
        return next({ name: "ValidationError", message: "Comment missing" });
    }

    try {
        const blog = await Blog.findById(request.params.id);
        if (!blog) {
            return next({ name: "NotFoundError", message: "Blog not found" });
        }
        const newComment = await new Comment({
            comment,
            user: user._id,
        }).save();

        blog.comments = blog.comments.concat(newComment._id);
        await blog.save();
        await newComment.populate("user", {
            username: 1,
            id: 1,
        });
        response.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
});

blogsRouter.delete(
    "/:blogid/comments/:commentid",
    async (request, response, next) => {
        try {
            const user = request.user;
            if (!user) {
                return next({ name: "JsonWebTokenError" });
            }

            const blog = await Blog.findById(request.params.blogid);
            if (!blog) {
                return next({
                    name: "ValidationError",
                    message: "Comment blog not found",
                });
            }

            const comment = await Comment.findById(request.params.commentid);
            if (!comment) {
                return next({
                    name: "NotFoundError",
                    message: "Comment not found",
                });
            }

            // Comment can only be deleted by blog creator or comment author
            if (
                blog.user.toString() !== user._id.toString() &&
                comment.user.toString() !== user._id.toString()
            ) {
                return next({
                    name: "AuthenticationError",
                    message: "Authoriization Denied",
                });
            }

            blog.comments = blog.comments.filter(
                id => id !== request.params.commentid
            );

            await blog.save();
            await comment.delete();

            response.status(204).end();
        } catch (error) {
            next(error);
        }
    }
);

module.exports = blogsRouter;
