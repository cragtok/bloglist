import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/userReducer";
import { displayNotification } from "../reducers/notificationReducer";
import { setLoadingState } from "../reducers/loadingReducer";
import useData from "./useData";
import { useNavigate } from "react-router-dom";

const useLoginAndRegister = () => {
    const dispatch = useDispatch();

    const userService = useData("/api/users");
    const loginService = useData("/api/login");

    const navigate = useNavigate();

    const { isLoading } = useSelector(state => state.loading);

    const register = async (username, name, password) => {
        try {
            dispatch(setLoadingState(true));
            await userService.create({ username, name, password });
            await login(username, password);
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
            dispatch(setLoadingState(false));
        }
    };

    const login = async (username, password) => {
        if (!isLoading) {
            dispatch(setLoadingState(true));
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
            dispatch(displayNotification(`Welcome ${username}!`, "success", 4));
            navigate("/");
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
        }
        dispatch(setLoadingState(false));
    };

    return [isLoading, { login, register }];
};

export default useLoginAndRegister;
