import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home";
import Notification from "./components/Notification";
import Users from "./components/Users";
import LoginAndSignupForm from "./components/LoginAndSignupForm";
import User from "./components/User";
import Blog from "./components/Blog";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";

import { setUser } from "./reducers/userReducer";
// import { setUsers } from "./reducers/usersReducer";

import "./App.css";
import { setLoadingState } from "./reducers/loadingReducer";

const App = () => {
    const dispatch = useDispatch();

    const notification = useSelector(state => state.notification);

    useEffect(() => {
        dispatch(setLoadingState(true));
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");

        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            dispatch(setUser(user));
        }
        dispatch(setLoadingState(false));
    }, []);

    const isLoggedIn = () => {
        return window.localStorage.getItem("loggedInUser") !== null
            ? true
            : false;
    };

    return (
        <div className="container">
            {isLoggedIn() && <Navbar />}

            {notification.message && notification.type && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                />
            )}

            <Routes>
                <Route
                    path="/users/:id"
                    element={
                        isLoggedIn() ? (
                            <User />
                        ) : (
                            <Navigate replace to="/login" />
                        )
                    }
                />
                <Route
                    path="/users"
                    element={
                        isLoggedIn() ? (
                            <Users />
                        ) : (
                            <Navigate replace to="/login" />
                        )
                    }
                />
                <Route
                    path="/blogs/:id"
                    element={
                        isLoggedIn() ? (
                            <Blog />
                        ) : (
                            <Navigate replace to="/login" />
                        )
                    }
                />
                <Route
                    path="/login"
                    element={
                        isLoggedIn() ? (
                            <Navigate replace to="/" />
                        ) : (
                            <LoginAndSignupForm />
                        )
                    }
                />
                <Route
                    path="/register"
                    element={
                        isLoggedIn() ? (
                            <Navigate replace to="/" />
                        ) : (
                            <LoginAndSignupForm />
                        )
                    }
                />
                <Route
                    exact
                    path="/"
                    element={
                        isLoggedIn() ? (
                            <Home />
                        ) : (
                            <Navigate replace to="/login" />
                        )
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;
