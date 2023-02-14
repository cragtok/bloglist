import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    home: { sortCategory: "", sortMethod: "" },
    blogs: { sortCategory: "", sortMethod: "" },
    users: { sortCategory: "", sortMethod: "" },
};

const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        setFormState(state, action) {
            // payload: {page, formState}
            return {
                ...initialState,
                [action.payload.page]: { ...action.payload.formState },
            };
        },
    },
});
export const { setFormState } = formSlice.actions;
export default formSlice.reducer;
