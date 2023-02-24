import { createSlice } from "@reduxjs/toolkit";

export const initialBlogFilters = {
    author: "",
    title: "",
    url: "",
    date: { from: "", to: "" },
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
const initialState = {
    home: {
        filterCategories: { ...initialBlogFilters },
        sortCategory: "",
        sortMethod: "descending",
    },
    blogs: {
        filterCategories: { ...initialBlogFilters },
        sortCategory: "",
        sortMethod: "descending",
    },
    users: {
        filterCategories: { ...initialUserFilters },
        sortCategory: "",
        sortMethod: "descending",
    },
};

const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        resetFormState() {
            return { ...initialState };
        },
        setFormState(state, action) {
            // payload: {page, formState}
            return {
                ...state,
                [action.payload.page]: { ...action.payload.formState },
            };
        },
    },
});
export const { setFormState, resetFormState } = formSlice.actions;
export default formSlice.reducer;
