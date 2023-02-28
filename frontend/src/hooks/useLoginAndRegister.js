import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/userReducer";
import { displayNotification } from "../reducers/notificationReducer";
import { setLoadingState } from "../reducers/loadingReducer";
import useAPI from "./useAPI";
import { useNavigate } from "react-router-dom";

const useLoginAndRegister = () => {
    const dispatch = useDispatch();

    const userService = useAPI("/api/users");
    const loginService = useAPI("/api/login");

    const navigate = useNavigate();

    const { isLoading } = useSelector(state => state.loading);

    const register = async (username, name, password) => {
        try {
            dispatch(setLoadingState(true));
            await userService.create({ username, name, password });
            await login(username, password);
        } catch (error) {
            let errorMsg;
            if (error.name === "CanceledError") {
                errorMsg = "Request Timed Out";
            } else if (error.response.data) {
                errorMsg = error.response.data.error;
            } else {
                errorMsg = "Error: Something Went Wrong!";
            }
            dispatch(displayNotification(errorMsg, "error", 4));
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
            let errorMsg;
            if (error.name === "CanceledError") {
                errorMsg = "Request Timed Out";
            } else if (error.response.data.error) {
                errorMsg = error.response.data.error;
            } else {
                errorMsg = "Error: Something Went Wrong!";
            }
            dispatch(displayNotification(errorMsg, "error", 4));
        }
        dispatch(setLoadingState(false));
    };

    return [isLoading, { login, register }];
};

export default useLoginAndRegister;
