export const initialBlogFilters = {
    author: "",
    title: "",
    url: "",
    createdAt: { from: "", to: "" },
    numComments: { from: 0, to: 0 },
    numLikes: { from: 0, to: 0 },
    likedBlogs: false,
    commentedBlogs: false,
};

export const initialUserFilters = {
    username: "",
    blogs: { from: 0, to: 0 },
    totalBlogLikes: { from: 0, to: 0 },
    totalBlogComments: { from: 0, to: 0 },
};
