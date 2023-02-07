import { useDispatch } from "react-redux";
import { setBlogs } from "../reducers/blogsReducer";
// import { setUsers } from "../reducers/usersReducer";
import { setUser } from "../reducers/userReducer";
import { displayNotification } from "../reducers/notificationReducer";
import useData from "./useData";

const useLoginAndRegister = () => {
    const dispatch = useDispatch();

    const userService = useData("/api/users");
    const blogService = useData("/api/blogs");
    const loginService = useData("/api/login");

    const register = async (username, name, password) => {
        try {
            await userService.create({ username, name, password });
            await login(username, password);
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
        }
    };

    const login = async (username, password) => {
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
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
        }
    };

    return { login, register };
};

export default useLoginAndRegister;
