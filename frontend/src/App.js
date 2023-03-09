import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Users from "./pages/Users";
import LoginAndSignupForm from "./pages/LoginAndSignupForm";
import User from "./pages/User";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import Notification from "./components/Notification";

import { setUser } from "./reducers/userReducer";

import { getLocalStorageUserJSON, isLoggedIn } from "./utils/localStorageUtils";

import "./App.css";

const App = () => {
    const dispatch = useDispatch();

    const notification = useSelector(state => state.notification);

    useEffect(() => {
        if (isLoggedIn()) {
            dispatch(setUser(getLocalStorageUserJSON()));
        }
    }, []);

    return (
        <div className="container is-fluid">
            <Navbar />
            <br />
            {notification.message && notification.type && (
                <div
                    style={{
                        position: "fixed",
                        zIndex: 1,
                        left: "2%",
                        right: "2%",
                    }}
                >
                    <Notification
                        message={notification.message}
                        type={notification.type}
                    />
                </div>
            )}
            <div
                style={{
                    marginTop:
                        notification.message && notification.type
                            ? "100px"
                            : "37px",
                }}
            >
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
        </div>
    );
};

export default App;
