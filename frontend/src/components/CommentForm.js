import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postComment } from "../reducers/blogsReducer";
import { displayNotification } from "../reducers/notificationReducer";

const CommentForm = ({ blogId }) => {
    const [comment, setComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const dispatch = useDispatch();

    const addComment = async e => {
        e.preventDefault();
        setIsSubmittingComment(true);
        const statusObj = await dispatch(postComment(blogId, comment));
        if (statusObj.success) {
            dispatch(displayNotification("Comment Added", "success", 2));
            setComment("");
        } else {
            dispatch(displayNotification(statusObj.message, "error", 4));
        }
        setIsSubmittingComment(false);
    };
    return (
        <div>
            <form onSubmit={addComment} className="box">
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
