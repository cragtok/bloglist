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

import useData from "./hooks/useData";

import { setBlogs } from "./reducers/blogsReducer";
import { setUser } from "./reducers/userReducer";
// import { setUsers } from "./reducers/usersReducer";

import "./App.css";
import { setNotification } from "./reducers/notificationReducer";

const App = () => {
    const dispatch = useDispatch();

    const notification = useSelector(state => state.notification);
    const blogs = useSelector(state =>
        [...state.blogs].sort((a, b) => b.likes - a.likes)
    );

    const blogService = useData("/api/blogs");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fetchAppData = async () => {
            const user = JSON.parse(loggedUserJSON);
            dispatch(setUser(user));

            blogService.setServiceToken(user.token);
            try {
                const blogs = await blogService.getAll();
                //        const users = await usersService.getAll();
                dispatch(setBlogs(blogs));
                //       dispatch(setUsers(users));
            } catch (error) {
                setNotification(error.response.data.error, "error", 4);
            }
        };
        if (loggedUserJSON) {
            fetchAppData();
        }
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
                            <Home blogs={blogs} />
                        ) : (
                            <Navigate replace to="/login" />
                        )
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
