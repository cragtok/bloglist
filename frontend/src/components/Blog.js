import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLoggedInUser } from "../hooks";

import { deleteBlog, likeBlog, unlikeBlog } from "../reducers/blogsReducer";
import { displayNotification } from "../reducers/notificationReducer";
import {
    removeUserBlog,
    likeUserBlog,
    unlikeUserBlog,
} from "../reducers/usersReducer";

import CommentForm from "./CommentForm";
import Togglable from "./Togglable";

const Blog = () => {
    const dispatch = useDispatch();
    const id = useParams().id;
    const navigate = useNavigate();
    const blog = useSelector(state => state.blogs.find(blog => blog.id === id));

    const [isSubmittingLike, setIsSubmittingLike] = useState(false);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

    const loggedInUser = useLoggedInUser();

    const handleLike = async action => {
        setIsSubmittingLike(true);

        let statusObj;
        if (action === "like") {
            statusObj = await dispatch(likeBlog(blog));
        }
        if (action === "unlike") {
            statusObj = await dispatch(unlikeBlog(blog));
        }

        if (statusObj.success) {
            if (action === "like") {
                dispatch(
                    likeUserBlog({ userId: blog.user.id, blogId: blog.id })
                );
            } else {
                dispatch(
                    unlikeUserBlog({ userId: blog.user.id, blogId: blog.id })
                );
            }
            dispatch(
                displayNotification(
                    `Blog post ${blog.title} ${
                        action === "like" ? "liked" : "unliked"
                    }`,
                    "success",
                    4
                )
            );
        } else {
            dispatch(displayNotification(statusObj.message, "error", 4));
        }
        setIsSubmittingLike(false);
    };

    const handleRemove = async () => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        setIsSubmittingDelete(true);
        const statusObj = await dispatch(deleteBlog(blog.id));
        if (statusObj.success) {
            dispatch(displayNotification("Blog post deleted", "success", 4));
            dispatch(removeUserBlog({ blogId: blog.id, userId: blog.user.id }));
            navigate("/");
            setIsSubmittingDelete(false);
        } else {
            dispatch(displayNotification(statusObj.message, "error", 4));
            setIsSubmittingDelete(false);
        }
    };

    if (!blog) {
        return <p>Blog not found</p>;
    }

    const showDeleteButton = blog.user.id === loggedInUser.user.id;

    const hasLikedBlog = blog.userLikes.find(id => id === loggedInUser.user.id);
    return (
        <div>
            <div className="card">
                <div className="card-content">
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-3">{blog.title}</p>
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
                    <CommentForm blogId={blog.id} />
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
