import React from "react";

const Notification = ({ message, type, removeNotification }) => {
    return (
        <div
            style={{
                position: "fixed",
                zIndex: 1,
                left: "2%",
                right: "2%",
            }}
        >
            <div
                className={`notification mt-2 ${
                    type === "error" ? "is-danger" : "is-success"
                }`}
            >
                <button
                    className="delete"
                    onClick={removeNotification}
                ></button>
                {message}
            </div>
        </div>
    );
};

export default Notification;
