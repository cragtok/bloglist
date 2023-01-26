import { createSlice } from "@reduxjs/toolkit";

const blogsSlice = createSlice({
    name: "blogs",
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload;
        },
        addBlog(state, action) {
            return [...state, action.payload];
        },
        removeBlog(state, action) {
            return state.filter(blog => blog.id !== action.payload);
        },
        updateBlog(state, action) {
            return state.map(blog =>
                blog.id === action.payload.id ? action.payload : blog
            );
        },
        addComment(state, action) {
            return state.map(blog => {
                if (blog.id === action.payload.blogId) {
                    const updatedBlog = {
                        ...blog,
                        user: blog.user,
                        comments: blog.comments.concat(action.payload.comment),
                    };
                    return updatedBlog;
                }
                return blog;
            });
        },
    },
});

export const { setBlogs, addBlog, removeBlog, updateBlog, addComment } =
    blogsSlice.actions;
export default blogsSlice.reducer;
