import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogsReducer from "./reducers/blogsReducer";
import userReducer from "./reducers/userReducer";
import usersReducer from "./reducers/usersReducer";
import loadingReducer from "./reducers/loadingReducer";
import formReducer from "./reducers/formReducer";

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogsReducer,
        user: userReducer,
        users: usersReducer,
        loading: loadingReducer,
        form: formReducer,
    },
});

export default store;
