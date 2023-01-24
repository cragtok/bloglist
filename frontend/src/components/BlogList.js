import PropTypes from "prop-types";
import BlogLink from "./BlogLink";

const BlogList = ({ blogs }) => {
    if (blogs.length === 0) {
        return null;
    }

    return (
        <div>
            {blogs.map(blog => (
                <BlogLink
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    author={blog.author}
                />
            ))}
        </div>
    );
};

BlogList.propTypes = {
    blogs: PropTypes.array.isRequired,
};
export default BlogList;
