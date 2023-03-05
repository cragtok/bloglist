import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useAPI from "./useAPI";

import { setUser } from "../reducers/userReducer";
import { displayNotification } from "../reducers/notificationReducer";
import { setLoadingState } from "../reducers/loadingReducer";

import generateErrorMessage from "../utils/generateErrorMessage";
import {
    clearLocalStorageUser,
    setLocalStorageUser,
} from "../utils/localStorageUtils";

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
            dispatch(
                displayNotification(generateErrorMessage(error), "error", 4)
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
            clearLocalStorageUser();
            setLocalStorageUser(loggedInUser);
            dispatch(displayNotification(`Welcome ${username}!`, "success", 4));
            navigate("/");
        } catch (error) {
            dispatch(
                displayNotification(generateErrorMessage(error), "error", 4)
            );
        }
        dispatch(setLoadingState(false));
    };

    return [isLoading, { login, register }];
};

export default useLoginAndRegister;
