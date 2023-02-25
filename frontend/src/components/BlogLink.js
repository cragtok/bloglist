import React from "react";
import { Link } from "react-router-dom";
const blogStyle = {
    padding: 5,
    border: "solid",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
};

const BlogLink = ({ blog, sortedField, filteredFields }) => {
    const { id, title, author, createdAt, comments, likes, url } = blog;
    const blogDate = new Date(createdAt).toDateString().slice(4);
    const blogTime = new Date(createdAt).toLocaleTimeString();

    const setFieldColor = field =>
        sortedField.field === field || filteredFields.includes(field)
            ? "has-text-success"
            : "";

    const renderFilteredFields = () => {
        return filteredFields.map(filteredField => {
            let filteredText;
            /*eslint-disable indent */
            switch (filteredField) {
                case "numComments":
                    filteredText = `Comments: ${comments.length}`;
                    break;
                case "numLikes":
                    filteredText = `Likes: ${likes}`;
                    break;
                case "url":
                    filteredText = `URL: ${url}`;
                    break;
                case "likedBlogs":
                    filteredText = "Liked";
                    break;
                case "commentedBlogs":
                    filteredText = "Commented";
                    break;
                default:
                    return null;
            }
            return (
                <p className="has-text-success" key={crypto.randomUUID()}>
                    {filteredText}
                </p>
            );
        });
    };

    return (
        <Link to={`/blogs/${id}`}>
            <div style={blogStyle}>
                <p
                    className={`subtitle-6 is-italic ${
                        setFieldColor("date") || setFieldColor("createdAt")
                    }`}
                >
                    {blogDate} {blogTime}
                </p>
                <span className={setFieldColor("title")}>{title}</span> by{" "}
                <span className={setFieldColor("author")}>{author}</span>
                {(sortedField.field === "comments" ||
                    sortedField.field === "likes") && (
                    <p className="has-text-success">
                        {sortedField.field}: {sortedField.value}
                    </p>
                )}
                {filteredFields.length > 0 && <>{renderFilteredFields()}</>}
            </div>
        </Link>
    );
};

export default BlogLink;
