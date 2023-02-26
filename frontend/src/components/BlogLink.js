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

    const setTextStyle = field => {
        let textClass = "";
        if (filteredFields.includes(field)) {
            textClass += "has-text-info";
        }
        if (sortedField === field) textClass += " has-text-weight-bold";
        return textClass;
    };

    const selectStyledText = filteredField => {
        /*eslint-disable indent */
        let filteredText;
        switch (filteredField) {
            case "url":
                filteredText = `URL: ${url}`;
                break;
            case "likedBlogs":
                filteredText = "Liked";
                break;
            case "commentedBlogs":
                filteredText = "Commented";
                break;
            case "numLikes":
                filteredText = `Likes: ${likes}`;
                break;
            case "numComments":
                filteredText = `Comments: ${comments.length}`;
                break;
            default:
                filteredText = "";
        }
        return filteredText;
    };

    const renderStyledFields = () => {
        let styledFields = filteredFields.includes(sortedField)
            ? [...filteredFields]
            : [...filteredFields, sortedField];

        return styledFields.map(field => (
            <p key={crypto.randomUUID()} className={setTextStyle(field)}>
                {selectStyledText(field)}
            </p>
        ));
    };

    const blogDate = new Date(createdAt).toDateString().slice(4);
    const blogTime = new Date(createdAt).toLocaleTimeString();

    return (
        <Link to={`/blogs/${id}`}>
            <div style={blogStyle}>
                <p
                    className={`subtitle-6 is-italic ${setTextStyle(
                        "createdAt"
                    )}`}
                >
                    {blogDate} {blogTime}
                </p>
                <span className={setTextStyle("title")}>{title}</span> by{" "}
                <span className={setTextStyle("author")}>{author}</span>
                {(filteredFields.length > 0 || sortedField) &&
                    renderStyledFields()}
            </div>
        </Link>
    );
};

export default BlogLink;
