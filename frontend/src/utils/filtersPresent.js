export const blogFiltersPresent = filterCategories =>
    filterCategories &&
    (filterCategories.author ||
        filterCategories.title ||
        filterCategories.url ||
        filterCategories.createdAt.from ||
        filterCategories.createdAt.to ||
        filterCategories.numComments.from ||
        filterCategories.numComments.to ||
        filterCategories.numLikes.from ||
        filterCategories.numLikes.to ||
        filterCategories.likedBlogs ||
        filterCategories.commentedBlogs);

export const userFiltersPresent = filterCategories =>
    filterCategories &&
    (filterCategories.username ||
        filterCategories.blogs.from ||
        filterCategories.blogs.to ||
        filterCategories.totalBlogLikes.from ||
        filterCategories.totalBlogLikes.to ||
        filterCategories.totalBlogComments.from ||
        filterCategories.totalBlogComments.to);
