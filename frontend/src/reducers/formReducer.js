import { createSlice } from "@reduxjs/toolkit";
import {
    initialBlogFilters,
    initialUserFilters,
} from "../utils/filterFieldData";

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
        setFilterCategories(state, action) {
            // payload: {page, filterCategories}
            return {
                ...state,
                [action.payload.page]: {
                    ...state[action.payload.page],
                    filterCategories: { ...action.payload.filterCategories },
                },
            };
        },
        setSortCategory(state, action) {
            // payload: {page, sortCategory}
            return {
                ...state,
                [action.payload.page]: {
                    ...state[action.payload.page],
                    sortCategory: action.payload.sortCategory,
                },
            };
        },
        setSortMethod(state, action) {
            // payload: {page, sortMethod}
            return {
                ...state,
                [action.payload.page]: {
                    ...state[action.payload.page],
                    sortMethod: action.payload.sortMethod,
                },
            };
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
export const {
    setFormState,
    resetFormState,
    setFilterCategories,
    setSortCategory,
    setSortMethod,
} = formSlice.actions;
export default formSlice.reducer;
