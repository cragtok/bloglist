import React, { useState } from "react";

const CommentForm = ({ postComment, isSubmittingComment }) => {
    const [comment, setComment] = useState("");

    return (
        <div>
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    if (await postComment(comment)) {
                        setComment("");
                    }
                }}
                className="box"
            >
                {/*eslint-disable indent */}
                <div
                    className={`control
                            ${
                                isSubmittingComment
                                    ? " is-loading is-large"
                                    : ""
                            }`}
                >
                    <textarea
                        value={comment}
                        disabled={isSubmittingComment}
                        className="textarea is-small"
                        onChange={e => setComment(e.target.value)}
                        maxLength={150}
                        placeholder="Add comment..."
                    ></textarea>
                    <br />
                    <button
                        disabled={isSubmittingComment}
                        className={`button is-primary${
                            isSubmittingComment ? " is-loading" : ""
                        }`}
                    >
                        Add Comment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;
