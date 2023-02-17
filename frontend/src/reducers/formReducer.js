import { createSlice } from "@reduxjs/toolkit";

const initialFilters = {
    author: "",
    title: "",
    url: "",
    date: { from: "", to: "" },
    numComments: { from: 0, to: 0 },
    numLikes: { from: 0, to: 0 },
    likedBlogs: false,
    commentedBlogs: false,
};

const initialState = {
    home: {
        filterCategories: { ...initialFilters },
        sortCategory: "",
        sortMethod: "descending",
    },
    blogs: {
        filterCategories: { ...initialFilters },
        sortCategory: "",
        sortMethod: "descending",
    },
    users: {
        filterCategories: { ...initialFilters },
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
