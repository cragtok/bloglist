import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
};

const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoadingState(state, action) {
            return { isLoading: action.payload };
        },
    },
});
export const { setLoadingState } = loadingSlice.actions;
export default loadingSlice.reducer;
