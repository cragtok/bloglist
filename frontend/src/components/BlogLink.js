import React from "react";
import { Link } from "react-router-dom";
const blogStyle = {
    padding: 5,
    border: "solid",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
};

const BlogLink = ({ blog, sortedField }) => {
    const { id, title, author, createdAt } = blog;
    const blogDate = new Date(createdAt).toDateString().slice(4);
    const blogTime = new Date(createdAt).toLocaleTimeString();

    const renderSortedColor = field =>
        sortedField.field === field ? "has-text-success" : "";

    return (
        <Link to={`/blogs/${id}`}>
            <div style={blogStyle}>
                <p
                    className={`subtitle-6 is-italic ${renderSortedColor(
                        "createdAt"
                    )}`}
                >
                    {blogDate} {blogTime}
                </p>
                <span className={renderSortedColor("title")}>{title}</span> by{" "}
                <span className={renderSortedColor("author")}>{author}</span>
                {sortedField.field === "comments" ||
                sortedField.field === "likes" ? (
                    /* eslint-disable */
                    <p className="has-text-success">
                        {sortedField.field}: {sortedField.value}
                    </p>
                ) : null}
            </div>
        </Link>
    );
};

export default BlogLink;
