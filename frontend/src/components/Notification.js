import React from "react";

const Notification = ({ message, type }) => {
    return (
        <article
            style={{
                width: "100%",
            }}
            className={`message  mt-2 ${
                type === "error" ? "is-danger" : "is-success"
            }`}
        >
            <div className="message-body">{message}</div>
        </article>
    );
};

export default Notification;
