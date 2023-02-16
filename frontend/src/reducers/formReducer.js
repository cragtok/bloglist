import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    home: { sortCategory: "", sortMethod: "descending" },
    blogs: { sortCategory: "", sortMethod: "descending" },
    users: { sortCategory: "", sortMethod: "descending" },
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
