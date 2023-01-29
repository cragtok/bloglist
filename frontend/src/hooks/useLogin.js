import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBlogs } from "../reducers/blogsReducer";
// import { setUsers } from "../reducers/usersReducer";
import { setUser } from "../reducers/userReducer";
import { displayNotification } from "../reducers/notificationReducer";
import useData from "./useData";

const useLogin = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userService = useData("/api/users");
    const blogService = useData("/api/blogs");
    const loginService = useData("/api/login");

    const register = async (username, name, password) => {
        setIsSubmitting(true);
        try {
            await userService.create({ username, name, password });
            await login(username, password);
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
            setIsSubmitting(false);
        }
    };

    const login = async (username, password) => {
        if (!isSubmitting) {
            setIsSubmitting(true);
        }

        try {
            const loggedInUser = await loginService.create({
                username,
                password,
            });
            dispatch(setUser(loggedInUser));
            window.localStorage.clear();
            window.localStorage.setItem(
                "loggedInUser",
                JSON.stringify(loggedInUser)
            );
            blogService.setServiceToken(loggedInUser.token);
            userService.setServiceToken(loggedInUser.token);
            const blogs = await blogService.getAll();
            //            const users = await userService.getAll();
            dispatch(setBlogs(blogs));
            //           dispatch(setUsers(users));
            setIsSubmitting(false);
            navigate("/");
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
            setIsSubmitting(false);
        }
    };

    return [isSubmitting, { login, register }];
};

export default useLogin;
