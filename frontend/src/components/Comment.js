import React from "react";

const Comment = ({ comment }) => {
    const commentDate = new Date(comment.createdAt).toDateString().slice(4);
    const commentTime = new Date(comment.createdAt).toLocaleTimeString();

    return (
        <article className="message is-success">
            <div className="message-header">
                <p>{comment.user.username}</p>
                <p>
                    {commentDate} {commentTime}
                </p>
            </div>
            <div className="message-body">{comment.comment}</div>
        </article>
    );
};

export default Comment;
