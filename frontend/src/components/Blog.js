import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { removeBlog, updateBlog } from "../reducers/blogsReducer";
import { displayNotification } from "../reducers/notificationReducer";
import {
    removeUserBlog,
    likeUserBlog,
    unlikeUserBlog,
} from "../reducers/usersReducer";

import useData from "../hooks/useData";

import CommentForm from "./CommentForm";
import Togglable from "./Togglable";

const Blog = () => {
    const dispatch = useDispatch();
    const id = useParams().id;
    const navigate = useNavigate();
    const blog = useSelector(state => state.blogs.find(blog => blog.id === id));
    const { isLoading } = useSelector(state => state.loading);

    const [isSubmittingLike, setIsSubmittingLike] = useState(false);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

    const loggedInUser = useSelector(state => state.user);
    const blogService = useData("/api/blogs");

    const handleRemove = async () => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        try {
            setIsSubmittingDelete(true);
            blogService.setServiceToken(loggedInUser.token);
            await blogService.remove(blog.id);
            dispatch(removeBlog(blog.id));
            dispatch(removeUserBlog({ blogId: blog.id, userId: blog.user.id }));
            dispatch(displayNotification("Blog post deleted", "success", 4));
            setIsSubmittingDelete(false);
            navigate("/");
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
            setIsSubmittingDelete(false);
        }
    };

    const handleLike = async action => {
        setIsSubmittingLike(true);

        try {
            blogService.setServiceToken(loggedInUser.token);
            const updatedBlog = await blogService.update({
                ...blog,
                user: blog.user.id,
                likes: blog.likes - 1,
                action,
            });
            dispatch(updateBlog(updatedBlog));

            const updateObj = {
                userId: updatedBlog.user.id,
                blogId: updatedBlog.id,
            };

            action === "like"
                ? dispatch(likeUserBlog(updateObj))
                : dispatch(unlikeUserBlog(updateObj));

            dispatch(
                displayNotification(
                    `Blog post ${blog.title} ${action}d`,
                    "success",
                    4
                )
            );
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
        }
        setIsSubmittingLike(false);
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!blog) {
        return <p>Blog not found</p>;
    }

    const showDeleteButton = blog.user.id === loggedInUser.id;
    const hasLikedBlog = blog.userLikes.find(id => id === loggedInUser.id);
    const blogDate = new Date(blog.createdAt).toDateString().slice(4);
    const blogTime = new Date(blog.createdAt).toLocaleTimeString();

    return (
        <div>
            <div className="card">
                <div className="card-content">
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-3">{blog.title}</p>
                            <p className="subtitle is-6 is-italic">
                                {blogDate} {blogTime}
                            </p>
                            <p className="subtitle is-6">
                                added by{" "}
                                <Link to={`/users/${blog.user.id}`}>
                                    {blog.author}
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="content">
                        <p className="subtitle is-6">Likes: {blog.likes}</p>
                        <a
                            className="blog-url subtitle"
                            href={
                                blog.url.includes("http://")
                                    ? blog.url
                                    : `http://${blog.url}`
                            }
                        >
                            {blog.url}
                        </a>
                    </div>
                </div>
                <footer className="card-footer">
                    {showDeleteButton && (
                        <a
                            className={`card-footer-item button is-outlined is-danger is-radiusless${
                                isSubmittingDelete ? " is-loading" : ""
                            }`}
                            onClick={handleRemove}
                            disabled={isSubmittingDelete || isSubmittingLike}
                        >
                            Delete
                        </a>
                    )}
                    <a
                        className={`card-footer-item button is-outlined ${
                            hasLikedBlog ? "is-light is-info" : "is-success"
                        } is-radiusless${
                            isSubmittingLike ? " is-loading" : ""
                        }`}
                        onClick={() =>
                            handleLike(hasLikedBlog ? "unlike" : "like")
                        }
                        disabled={isSubmittingLike || isSubmittingDelete}
                    >
                        {hasLikedBlog ? "Unlike" : "Like"}
                    </a>
                </footer>
            </div>

            <div>
                <h3 className="title is-3 mt-3">Comments</h3>
                <Togglable buttonLabel="Add Comment">
                    <CommentForm
                        blogId={blog.id}
                        userId={blog.user.id}
                        token={loggedInUser.token}
                    />
                </Togglable>

                <br />
                {blog.comments.length > 0 &&
                    blog.comments.map(comment => (
                        <div className="card mb-3" key={crypto.randomUUID()}>
                            <div className="card-content">
                                <div className="content has-text-weight-light">
                                    {comment}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
export default Blog;
