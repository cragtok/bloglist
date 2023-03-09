import React from "react";

const Notification = ({ message, type }) => {
    return (
        <div
            className={`notification mt-2 ${
                type === "error" ? "is-danger" : "is-success"
            }`}
        >
            {message}
        </div>
    );
};

export default Notification;
