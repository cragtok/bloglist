import React from "react";
import { Link } from "react-router-dom";
const blogStyle = {
    padding: 5,
    border: "solid",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
};

const BlogLink = ({ id, title, author, createdAt }) => {
    const blogDate = new Date(createdAt).toDateString().slice(4);
    const blogTime = new Date(createdAt).toLocaleTimeString();
    return (
        <Link to={`/blogs/${id}`}>
            <div style={blogStyle}>
                <p className="subtitle-6 is-italic">
                    {blogDate} {blogTime}
                </p>
                {title} by {author}
            </div>
        </Link>
    );
};

export default BlogLink;
