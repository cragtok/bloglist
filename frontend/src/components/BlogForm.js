import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../reducers/blogsReducer";
import { displayNotification } from "../reducers/notificationReducer";
import { addUserBlog } from "../reducers/usersReducer";

const BlogForm = ({ toggleVisibility }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const notification = useSelector(state => state.notification);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addBlog = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        const statusObj = await dispatch(createBlog({ title, author, url }));
        if (statusObj.success) {
            setTitle("");
            setAuthor("");
            setUrl("");
            dispatch(addUserBlog(statusObj.newBlog));
            dispatch(
                displayNotification(
                    `a new blog post ${title} by ${author} added`,
                    "success",
                    4
                )
            );
            toggleVisibility();
            navigate(`/blogs/${statusObj.newBlog.id}`);
        } else {
            dispatch(displayNotification(statusObj.message, "error", 4));
        }
        setIsSubmitting(false);
    };
    return (
        <form className="box mt-2" onSubmit={addBlog}>
            <div className="mt-4">
                <label className="label"> Title: </label>
                <div>
                    <input
                        id="blog-title"
                        className={`input${
                            notification.type === "error" &&
                            notification.message.toLowerCase().includes("title")
                                ? " is-danger"
                                : ""
                        }`}
                        type="text"
                        name="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="blog title..."
                    />
                </div>
            </div>

            <div className="mt-4">
                <label className="label"> Author: </label>
                <input
                    id="blog-author"
                    className={`input${
                        notification.type === "error" &&
                        notification.message.toLowerCase().includes("author")
                            ? " is-danger"
                            : ""
                    }`}
                    type="text"
                    name="Author"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    placeholder="blog author..."
                />
            </div>

            <div className="mt-4">
                <label className="label"> URL: </label>
                <input
                    id="blog-url"
                    className={`input${
                        notification.type === "error" &&
                        notification.message.toLowerCase().includes("url")
                            ? " is-danger"
                            : ""
                    }`}
                    type="text"
                    name="Url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="blog url..."
                />
            </div>
            <button
                id="blog-create"
                className={`button is-primary is-fullwidth mt-4${
                    isSubmitting ? " is-loading" : ""
                }`}
                disabled={isSubmitting}
            >
                Create
            </button>
        </form>
    );
};

export default BlogForm;
