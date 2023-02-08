import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div>
            <br />
            <h1 className="title">Page Not Found</h1>
            <Link to="/">Home</Link>{" "}
            <Link onClick={() => history.back()}>Go Back</Link>
        </div>
    );
};

export default NotFound;
