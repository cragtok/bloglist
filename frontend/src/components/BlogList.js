import PropTypes from "prop-types";
import BlogLink from "./BlogLink";
import { useSelector } from "react-redux";
const BlogList = ({ blogs, sortedField }) => {
    const { blogsFetched, isLoading } = useSelector(state => state.loading);

    if (!blogsFetched || isLoading) {
        return <div>Loading...</div>;
    }

    if (blogsFetched && !blogs.length) {
        return <div>No Blogs</div>;
    }

    const getSortedField = blog => {
        if (sortedField === "comments") {
            return { field: "comments", value: blog.comments.length };
        }
        return { field: sortedField, value: blog[sortedField] };
    };
    return (
        <div>
            {blogs.map(blog => (
                <BlogLink
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    author={blog.author}
                    createdAt={blog.createdAt}
                    sortedField={getSortedField(blog)}
                />
            ))}
        </div>
    );
};

BlogList.propTypes = {
    blogs: PropTypes.array.isRequired,
};
export default BlogList;
