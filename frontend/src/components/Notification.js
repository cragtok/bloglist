import React from "react";

const Notification = ({ message, type }) => {
    return (
        <article
            className={`message mt-2 ${
                type === "error" ? "is-danger" : "is-success"
            }`}
        >
            <div className="message-body">{message}</div>
        </article>
    );
};

export default Notification;
