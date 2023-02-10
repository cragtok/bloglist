import PropTypes from "prop-types";
import BlogLink from "./BlogLink";
import { useSelector } from "react-redux";
import SortingForm from "./SortingForm";
import { useState } from "react";
const BlogList = ({ blogs }) => {
    const { isLoading } = useSelector(state => state.loading);

    const [sortCategory, setSortCategory] = useState("");
    const [sortMethod, setSortMethod] = useState("ascending");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (blogs.length === 0) {
        return <div>No Blogs</div>;
    }

    const sortFunc = (a, b) => {
        const compareValues = (a, b) => {
            if (a === b) {
                return 0;
            }

            if (sortMethod === "ascending") {
                return a > b ? 1 : -1;
            }

            if (sortMethod === "descending") {
                return a > b ? -1 : 1;
            }
        };

        if (!sortCategory) return 0;
        if (sortCategory === "title")
            return compareValues(a.title.toLowerCase(), b.title.toLowerCase());
        if (sortCategory === "author")
            return compareValues(
                a.author.toLowerCase(),
                b.author.toLowerCase()
            );
        if (sortCategory === "dateCreated")
            return compareValues(a.createdAt, b.createdAt);
        if (sortCategory === "numberOfLikes")
            return compareValues(a.likes, b.likes);
        if (sortCategory === "numberOfComments")
            return compareValues(a.comments.length, b.comments.length);
    };

    return (
        <div>
            <SortingForm
                sortCategory={sortCategory}
                setSortCategory={setSortCategory}
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
            />

            {[...blogs].sort(sortFunc).map(blog => (
                <BlogLink
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    author={blog.author}
                    createdAt={blog.createdAt}
                />
            ))}
        </div>
    );
};

BlogList.propTypes = {
    blogs: PropTypes.array.isRequired,
};
export default BlogList;
