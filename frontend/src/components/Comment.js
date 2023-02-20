import React from "react";

const Comment = ({ comment, displayDeleteButton, handleDeleteComment }) => {
    const commentDate = new Date(comment.createdAt).toDateString().slice(4);
    const commentTime = new Date(comment.createdAt).toLocaleTimeString();

    return (
        <article
            className="message is-success"
            style={{
                border: "1px solid #48c78e",
                borderLeft: "0",
            }}
        >
            <div className="message-body">
                <p className="is-italic has-text-weight-light">
                    {commentDate} {commentTime}{" "}
                </p>
                <p className="has-text-weight-bold mb-4">
                    {comment.user.username}
                </p>
                <p className="has-text-weight-normal">{comment.comment}</p>
                {displayDeleteButton && (
                    <button
                        className="button is-small is-outlined is-danger mt-2 mr-2"
                        onClick={handleDeleteComment}
                    >
                        Delete
                    </button>
                )}
            </div>
        </article>
    );
};

export default Comment;
