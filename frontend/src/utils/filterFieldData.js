export const blogFilterFields = [
    { name: "author", type: "text", label: "Author" },
    { name: "title", type: "text", label: "Title" },
    { name: "url", type: "text", label: "URL" },
    {
        name: "date",
        type: "range",
        rangeType: "date",
        label: "Date Created",
        ranges: {
            from: { name: "from", label: "Start" },
            to: { name: "to", label: "End" },
        },
    },
    {
        name: "numComments",
        type: "range",
        rangeType: "number",
        label: "Number of Comments",
        ranges: {
            from: { name: "from", label: "Min", min: 0 },
            to: { name: "to", label: "Max", min: 0 },
        },
    },
    {
        name: "numLikes",
        type: "range",
        rangeType: "number",
        label: "Number of Likes",
        ranges: {
            from: { name: "from", label: "Min", min: 0 },
            to: { name: "to", label: "Max", min: 0 },
        },
    },
    { name: "likedBlogs", type: "boolean", label: "Liked Blogs" },
    { name: "commentedBlogs", type: "boolean", label: "Commented Blogs" },
];

export const userFilterFields = [
    { name: "username", type: "text", label: "Username" },
    {
        name: "blogs",
        type: "range",
        rangeType: "number",
        label: "Number of Blogs",
        ranges: {
            from: { name: "from", label: "Min", min: 0 },
            to: { name: "to", label: "Max", min: 0 },
        },
    },
    {
        name: "totalBlogLikes",
        type: "range",
        rangeType: "number",
        label: "Total Number of Likes",
        ranges: {
            from: { name: "from", label: "Min", min: 0 },
            to: { name: "to", label: "Max", min: 0 },
        },
    },
    {
        name: "totalBlogComments",
        type: "range",
        rangeType: "number",
        label: "Total Number of Comments",
        ranges: {
            from: { name: "from", label: "Min", min: 0 },
            to: { name: "to", label: "Max", min: 0 },
        },
    },
];
