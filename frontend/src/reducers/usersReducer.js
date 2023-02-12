import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: "users",
    initialState: [],
    reducers: {
        setUsers(state, action) {
            return action.payload;
        },
        updateUser(state, action) {
            return state.map(user =>
                user.id === action.payload.id ? action.payload : user
            );
        },
        addUserBlog(state, action) {
            return state.map(user => {
                if (user.id === action.payload.user.id) {
                    const newBlog = { ...action.payload };
                    delete newBlog.user;
                    const updatedUser = {
                        ...user,
                        blogs: user.blogs.concat(newBlog),
                    };
                    return updatedUser;
                }
                return user;
            });
        },
        addUserComment(state, action) {
            // payload: {userId, blogId, comment}
            return state.map(user => {
                if (user.id === action.payload.userId) {
                    return {
                        ...user,
                        blogs: user.blogs.map(blog => {
                            if (blog.id === action.payload.blogId) {
                                return {
                                    ...blog,
                                    comments: blog.comments.concat(
                                        action.payload.comment
                                    ),
                                };
                            }
                            return blog;
                        }),
                    };
                }
                return user;
            });
        },
        removeUserBlog(state, action) {
            // payload: {userId, blogId}
            return state.map(user => {
                if (user.id === action.payload.userId) {
                    return {
                        ...user,
                        blogs: user.blogs.filter(
                            blog => blog.id !== action.payload.blogId
                        ),
                    };
                }
                return user;
            });
        },
        likeUserBlog(state, action) {
            return state.map(user => {
                if (user.id === action.payload.userId) {
                    return {
                        ...user,
                        blogs: user.blogs.map(blog =>
                            blog.id === action.payload.blogId
                                ? { ...blog, likes: blog.likes + 1 }
                                : blog
                        ),
                    };
                }
                return user;
            });
        },
        unlikeUserBlog(state, action) {
            return state.map(user => {
                if (user.id === action.payload.userId) {
                    return {
                        ...user,
                        blogs: user.blogs.map(blog =>
                            blog.id === action.payload.blogId
                                ? { ...blog, likes: blog.likes - 1 }
                                : blog
                        ),
                    };
                }

                return user;
            });
        },
    },
});

export const {
    setUsers,
    updateUser,
    addUserBlog,
    removeUserBlog,
    likeUserBlog,
    unlikeUserBlog,
    addUserComment,
} = usersSlice.actions;
export default usersSlice.reducer;
