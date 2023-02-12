import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../reducers/blogsReducer";
import { displayNotification } from "../reducers/notificationReducer";

import useData from "../hooks/useData";
import { addUserComment } from "../reducers/usersReducer";

const CommentForm = ({ blogId, userId, token }) => {
    const [comment, setComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const commentService = useData(`/api/blogs/${blogId}/comments`, token);
    const dispatch = useDispatch();

    const postComment = async e => {
        e.preventDefault();
        setIsSubmittingComment(true);

        try {
            const newComment = await commentService.create({ comment });
            dispatch(addComment({ blogId, comment: newComment }));
            dispatch(addUserComment({ userId, blogId, comment: newComment }));
            dispatch(displayNotification("Comment Added", "success", 2));
            setComment("");
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
        }
        setIsSubmittingComment(false);
    };
    return (
        <div>
            <form onSubmit={postComment} className="box">
                <div className="columns">
                    <div className="column is-three-quarters">
                        <input
                            className="input"
                            maxLength={150}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Add comment..."
                        />
                    </div>
                    <div className="column">
                        <button
                            disabled={isSubmittingComment}
                            className={`button is-fullwidth is-primary${
                                isSubmittingComment ? " is-loading" : ""
                            }`}
                        >
                            Add Comment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;
