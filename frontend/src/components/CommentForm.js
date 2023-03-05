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
