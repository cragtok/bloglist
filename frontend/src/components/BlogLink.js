import React from "react";
import { Link } from "react-router-dom";
const blogStyle = {
    padding: 5,
    border: "solid",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
};

const BlogLink = ({ id, title, author }) => {
    return (
        <Link to={`/blogs/${id}`}>
            <div style={blogStyle}>
                {title} by {author}
            </div>
        </Link>
    );
};

export default BlogLink;
