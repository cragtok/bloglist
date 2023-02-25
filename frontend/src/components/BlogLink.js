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

    const selectTextColor = field => {
        if (filteredFields.includes(field)) {
            return "has-text-info";
        }
        if (sortedField === field) return "has-text-success";
        return "";
    };

    const selectFilteredText = filteredField => {
        /*eslint-disable indent */
        let filteredText;
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
                filteredText = "";
        }
        return filteredText;
    };

    const renderFilteredFields = () => {
        return filteredFields.map(filteredField => {
            return (
                <p className="has-text-info" key={crypto.randomUUID()}>
                    {selectFilteredText(filteredField)}
                </p>
            );
        });
    };

    const selectSortedText = sortedField => {
        let sortedText = "";
        switch (sortedField) {
            case "likes":
                sortedText = `Likes: ${likes}`;
                break;
            case "comments":
                sortedText = `Comments: ${comments.length}`;
                break;
            default:
                sortedText = "";
        }
        return sortedText;
    };

    const renderSortedField = () => {
        return (
            <p className="has-text-success">{selectSortedText(sortedField)}</p>
        );
    };

    const blogDate = new Date(createdAt).toDateString().slice(4);
    const blogTime = new Date(createdAt).toLocaleTimeString();

    return (
        <Link to={`/blogs/${id}`}>
            <div style={blogStyle}>
                <p
                    className={`subtitle-6 is-italic ${
                        selectTextColor("date") || selectTextColor("createdAt")
                    }`}
                >
                    {blogDate} {blogTime}
                </p>
                <span className={selectTextColor("title")}>{title}</span> by{" "}
                <span className={selectTextColor("author")}>{author}</span>
                {sortedField && renderSortedField(sortedField)}
                {filteredFields.length > 0 && renderFilteredFields()}
            </div>
        </Link>
    );
};

export default BlogLink;
