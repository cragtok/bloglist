import PropTypes from "prop-types";
import BlogLink from "./BlogLink";
import { useSelector } from "react-redux";
const BlogList = ({ blogs }) => {
    const { isLoading } = useSelector(state => state.loading);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (blogs.length === 0) {
        return <div>No Blogs</div>;
    }

    return (
        <div>
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
