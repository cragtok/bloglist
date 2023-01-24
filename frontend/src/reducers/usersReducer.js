import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

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

export const fetchUsers = () => {
    return async dispatch => {
        const users = await usersService.getAll();
        dispatch(setUsers(users));
    };
};

export const {
    setUsers,
    updateUser,
    addUserBlog,
    removeUserBlog,
    likeUserBlog,
    unlikeUserBlog,
} = usersSlice.actions;
export default usersSlice.reducer;
