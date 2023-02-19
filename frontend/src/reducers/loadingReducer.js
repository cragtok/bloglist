import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    blogsFetched: false,
    usersFetched: false,
};

const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoadingState(state, action) {
            return { ...state, isLoading: action.payload };
        },
        setBlogsFetched(state, action) {
            return { ...state, blogsFetched: action.payload };
        },
        setUsersFetched(state, action) {
            return { ...state, usersFetched: action.payload };
        },
    },
});
export const { setLoadingState, setBlogsFetched, setUsersFetched } =
    loadingSlice.actions;
export default loadingSlice.reducer;
