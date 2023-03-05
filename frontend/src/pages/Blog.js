import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    addComment,
    addBlog,
    removeBlog,
    updateBlog,
    removeComment,
} from "../reducers/blogsReducer";
import {
    addUserComment,
    removeUserComment,
    removeUserBlog,
    likeUserBlog,
    unlikeUserBlog,
} from "../reducers/usersReducer";
import { displayNotification } from "../reducers/notificationReducer";
import { setLoadingState } from "../reducers/loadingReducer";

import useAPI from "../hooks/useAPI";

import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import Togglable from "../components/Togglable";

import { getLocalStorageToken } from "../utils/localStorageUtils";
import generateErrorMessage from "../utils/generateErrorMessage";

const Blog = () => {
    const dispatch = useDispatch();
    const id = useParams().id;
    const navigate = useNavigate();
    const blog = useSelector(state => state.blogs.find(blog => blog.id === id));
    const { isLoading, blogsFetched } = useSelector(state => state.loading);

    const [isSubmittingLike, setIsSubmittingLike] = useState(false);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isDeletingComment, setIsDeletingComment] = useState(false);

    const loggedInUser = useSelector(state => state.user);
    const blogService = useAPI("/api/blogs");
    const commentService = useAPI(`/api/blogs/${id}/comments`);

    useEffect(() => {
        let ignoreRequest = false;
        const fetchData = async () => {
            dispatch(setLoadingState(true));
            blogService.setServiceToken(getLocalStorageToken());
            try {
                const foundBlog = await blogService.getOne(id);
                if (ignoreRequest) {
                    return;
                }
                if (foundBlog) {
                    dispatch(addBlog(foundBlog));
                }
            } catch (error) {
                dispatch(
                    displayNotification(generateErrorMessage(error), "error", 4)
                );
            }
            dispatch(setLoadingState(false));
        };
        if (!blog && !blogsFetched) {
            fetchData();
        }

        return () => {
            ignoreRequest = true;
        };
    }, []);

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
                displayNotification(generateErrorMessage(error), "error", 4)
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
                comments: blog.comments.map(comment => comment.id),
                user: blog.user.id,
                action,
            });
            dispatch(updateBlog(updatedBlog));
            const updateObj = {
                userId: updatedBlog.user.id,
                blogId: updatedBlog.id,
                likedUserId: loggedInUser.id,
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
                displayNotification(generateErrorMessage(error), "error", 4)
            );
        }
        setIsSubmittingLike(false);
    };

    const handleDeleteComment = async commentId => {
        commentService.setServiceToken(loggedInUser.token);
        setIsDeletingComment(true);
        try {
            await commentService.remove(commentId);
            dispatch(removeComment({ blogId: id, commentId }));
            dispatch(
                removeUserComment({
                    userId: blog.user.id,
                    blogId: id,
                    commentId,
                })
            );
            dispatch(displayNotification("Comment Deleted!", "success", 4));
        } catch (error) {
            dispatch(
                displayNotification(generateErrorMessage(error), "error", 4)
            );
        }
        setIsDeletingComment(false);
    };

    const handlePostComment = async comment => {
        setIsSubmittingComment(true);
        let success = false;
        try {
            commentService.setServiceToken(loggedInUser.token);
            const newComment = await commentService.create({ comment });
            dispatch(addComment({ blogId: id, comment: newComment }));
            dispatch(
                addUserComment({
                    userId: blog.user.id,
                    blogId: id,
                    comment: newComment,
                })
            );
            dispatch(displayNotification("Comment Added", "success", 2));
            success = true;
        } catch (error) {
            dispatch(
                displayNotification(generateErrorMessage(error), "error", 4)
            );
        }
        setIsSubmittingComment(false);
        return success;
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
                                    {blog.user.username}
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="content">
                        <p className="subtitle is-6">Author: {blog.author}</p>
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
                        postComment={handlePostComment}
                        isSubmittingComment={isSubmittingComment}
                    />
                </Togglable>

                <br />
                <div className="mb-5">
                    {blog.comments.length > 0 &&
                        blog.comments.map(comment => (
                            <Comment
                                key={comment.id}
                                displayDeleteButton={
                                    blog.user.id === loggedInUser.id ||
                                    comment.user.id === loggedInUser.id
                                }
                                comment={comment}
                                handleDeleteComment={() =>
                                    handleDeleteComment(comment.id)
                                }
                                isDeletingComment={isDeletingComment}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};
export default Blog;
