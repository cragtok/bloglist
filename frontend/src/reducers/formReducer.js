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
