import BlogLink from "./BlogLink";
import { useSelector } from "react-redux";
const BlogList = ({ blogs, sortedField, filterCategories }) => {
    const { isLoading } = useSelector(state => state.loading);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!blogs.length) {
        return <div>No Blogs</div>;
    }

    const filters = Object.keys(filterCategories).filter(filterCategory => {
        const isRangedFilter = [
            "createdAt",
            "numComments",
            "numLikes",
        ].includes(filterCategory);

        const rangedFilterPresent =
            isRangedFilter &&
            (filterCategories[filterCategory].from ||
                filterCategories[filterCategory].to);

        const normalFilterPresent =
            !isRangedFilter && filterCategories[filterCategory];

        if (rangedFilterPresent || normalFilterPresent) {
            return filterCategory;
        }
    });

    return (
        <div id="bloglist">
            {blogs.map(blog => (
                <BlogLink
                    key={blog.id}
                    blog={blog}
                    sortedField={sortedField}
                    filteredFields={filters}
                />
            ))}
        </div>
    );
};

export default BlogList;
