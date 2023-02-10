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

    return (
        <div>
            <SortingForm
                sortCategory={sortCategory}
                setSortCategory={setSortCategory}
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
            />

            {blogs.map(blog => (
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
